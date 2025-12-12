const { Registration, Event, User } = require("../models");
const QRCode = require("qrcode");
const { genTokenHex } = require("../utils/cryptoUtils");
const { Op } = require("sequelize");

async function inscribirse(userId, eventoId) {
  const evento = await Event.findByPk(eventoId);
  if (!evento) throw { statusCode: 404, message: "Evento no encontrado." };

  const ahora = new Date();
  if (new Date(evento.dateTime) < ahora) {
    throw { statusCode: 400, message: "El evento ya pasó, no puedes inscribirte." };
  }

  const yaInscrito = await Registration.findOne({
  where: {
    userId,
    eventId: eventoId,
    status: { [Op.in]: ["pending", "accepted"] }
  }
});

if (yaInscrito) throw { statusCode: 400, message: "Ya estás inscrito en este evento." };

  if (evento.capacity && evento.capacity > 0) {
  const registrosActuales = await Registration.count({
    where: {
      eventId: eventoId,
      status: { [Op.in]: ["pending", "accepted"] } // solo ocupan cupo estos estados
    }
  });

  if (registrosActuales >= evento.capacity) {
    throw { statusCode: 400, message: "El evento alcanzó su capacidad máxima." };
  }
}
  // Generar token de validación
  const token = genTokenHex(16);

  const registro = await Registration.create({
    userId,
    eventId: eventoId,
    status: "pending",
    tokenValidacion: token,
  });

  return {
    mensaje: evento.precio === 0
      ? "Inscripción realizada con éxito. Espera a que el organizador la acepte."
      : "Inscripción creada. Debes subir el comprobante de pago.",
    registro,
    requiereComprobante: evento.precio > 0,
  };
}

async function subirComprobante(userId, eventoId, file) {
  if (!file) throw { statusCode: 400, message: "Debe subir un comprobante." };

  //const registro = await Registration.findOne({ where: { userId, eventId: eventoId } });
  const registro = await Registration.findOne({ 
  where: { userId, eventId: eventoId, status: "pending" } 
  });

  if (!registro) throw { statusCode: 400, message: "No tienes inscripción para este evento." };

  const evento = await Event.findByPk(eventoId);
  if (!evento) throw { statusCode: 404, message: "Evento no encontrado." };

  const ahora = new Date();
  if (new Date(evento.dateTime) < ahora) {
    throw { statusCode: 400, message: "El evento ya pasó, no puedes subir comprobante." };
  }

  registro.paymentProofPath = `uploads/comprobantes/${file.filename}`;
  await registro.save();

  return { mensaje: "Comprobante subido correctamente. Pendiente de validación del organizador.", registro };
}

async function generarQR(registroId) {
  const registro = await Registration.findByPk(registroId);
  if (!registro) throw { statusCode: 404, message: "Registro no encontrado." };

  const evento = await Event.findByPk(registro.eventId);
  if (!evento) throw { statusCode: 404, message: "Evento no encontrado." };

  const ahora = new Date();
  if (new Date(evento.dateTime) < ahora) {
    throw { statusCode: 400, message: "El evento ya pasó, no puedes generar ni validar QR." };
  }

  if (!registro.tokenValidacion) {
    registro.tokenValidacion = genTokenHex(16);
    await registro.save();
  }

  const urlQR = `${process.env.FRONTEND_URL}/validar-qr?token=${registro.tokenValidacion}`;
  const imagenQR = await QRCode.toDataURL(urlQR);

  return { mensaje: "QR generado correctamente.", qr: imagenQR, token: registro.tokenValidacion };
}

async function getMyRegistrations(userId) {
  const regs = await Registration.findAll({
    where: { userId },
    include: [{ model: Event, attributes: ["id", "title", "precio"] }],
  });

  return regs.map(r => ({
    id: r.id,
    eventId: r.eventId,
    eventTitle: r.Event.title,
    precio: r.Event.precio,
    status: r.status,
    paymentProofPath: r.paymentProofPath, 
    qrUrl: r.status === "accepted" && r.tokenValidacion
      ? `${process.env.FRONTEND_URL}/validar-qr?token=${r.tokenValidacion}`
      : null,
  }));
}

async function getRegistrationsByEvent(eventId, rol) {
  const evento = await Event.findByPk(eventId);
  if (!evento) throw { statusCode: 404, message: "Evento no encontrado." };

  if (rol !== "organizer") throw { statusCode: 403, message: "No tienes permisos para ver los inscritos." };

  const registros = await Registration.findAll({
    where: { eventId },
    include: [{ model: User, attributes: ["id", "nombre", "email"] }],
    order: [["createdAt", "ASC"]],
  });

  return registros.map(r => ({
    id: r.id,
    userId: r.userId,
    eventId: r.eventId,
    status: r.status,
    paymentProofPath: r.paymentProofPath
      ? r.paymentProofPath.replace(/\\\\/g, "/")
      : null,
    User: r.User,
    precio: evento.precio,
    eventTitle: evento.title,
  }));
}

async function cancelRegistration(registroId, user) {
  const registro = await Registration.findByPk(registroId);
  if (!registro) throw { statusCode: 404, message: "Registro no encontrado." };

  const evento = await Event.findByPk(registro.eventId);
  if (!evento) throw { statusCode: 404, message: "Evento no encontrado." };

  const ahora = new Date();
  if (new Date(evento.dateTime) < ahora) {
    throw { statusCode: 400, message: "El evento ya pasó, no puedes cancelar la inscripción." };
  }

  if (registro.status !== "rejected" && (registro.paymentProofPath || registro.status === "accepted")) {
    throw { statusCode: 400, message: "No puedes cancelar porque ya se realizó un pago o fue aceptado." };
  }

  const rol = user.Role?.name;
  const puedeCancelar = user.id === registro.userId || rol === "admin" || rol === "organizer";
  if (!puedeCancelar) throw { statusCode: 403, message: "No tienes permisos para cancelar esta inscripción." };

  await registro.destroy();
  return { mensaje: "Inscripción cancelada correctamente." };
}

async function validateComprobante(registroId, status, rol) {
  if (!["accepted", "rejected"].includes(status)) {
    throw { statusCode: 400, message: "Status inválido." };
  }

  const registro = await Registration.findByPk(registroId);
  if (!registro) throw { statusCode: 404, message: "Registro no encontrado." };

  const evento = await Event.findByPk(registro.eventId);
  if (!evento) throw { statusCode: 404, message: "Evento no encontrado." };

  const ahora = new Date();
  if (new Date(evento.dateTime) < ahora) {
    throw { statusCode: 400, message: "El evento ya pasó, no puedes aceptar ni rechazar inscripciones." };
  }

  if (evento.precio > 0 && !registro.paymentProofPath) {
    throw { statusCode: 400, message: "No puedes validar inscripción sin comprobante." };
  }

  if (rol !== "organizer") throw { statusCode: 403, message: "No tienes permisos para validar este comprobante." };

  registro.status = status;
  await registro.save();

  return { mensaje: `Inscripción ${status === "accepted" ? "aceptada" : "rechazada"}.`, registro };
}

async function deleteRegistration(registroId, rol) {
  const registro = await Registration.findByPk(registroId);
  if (!registro) throw { statusCode: 404, message: "Registro no encontrado." };

  const evento = await Event.findByPk(registro.eventId);
  if (!evento) throw { statusCode: 404, message: "Evento no encontrado." };

  if (rol !== "admin" && rol !== "organizer") {
    throw { statusCode: 403, message: "No tienes permisos para eliminar este inscrito." };
  }

  const nombreUsuario = (await User.findByPk(registro.userId))?.nombre || "Usuario desconocido";
  await registro.destroy();

  return { mensaje: `Inscrito ${nombreUsuario} eliminado correctamente.` };
}

module.exports = {
  inscribirse,
  subirComprobante,
  generarQR,
  getMyRegistrations,
  getRegistrationsByEvent,
  cancelRegistration,
  validateComprobante,
  deleteRegistration,
};
