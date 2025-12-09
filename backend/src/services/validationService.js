// services/qrService.js
const { Registration, User, Event } = require("../models");

async function validarQR(token) {
  if (!token) {
    throw { statusCode: 400, message: "Falta el token." };
  }

  const registro = await Registration.findOne({
    where: { tokenValidacion: token },
    include: [User, Event],
  });

  if (!registro) {
    throw { statusCode: 404, message: "QR inválido", status: "inválido" };
  }

  // Si ya fue usado
  if (registro.estadoIngreso === "checked") {
    return {
      mensaje: "El QR ya fue utilizado",
      participante: registro.User.nombre,
      evento: registro.Event.title,
      horaIngreso: registro.checkedInAt,
      status: "usado",
    };
  }

  // Marcar ingreso
  registro.estadoIngreso = "checked";
  registro.checkedInAt = new Date();
  await registro.save();

  return {
    mensaje: "QR validado correctamente",
    participante: registro.User.nombre,
    evento: registro.Event.title,
    horaIngreso: registro.checkedInAt,
    status: "válido",
  };
}

module.exports = { validarQR };
