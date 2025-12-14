const { Event, User, Registration } = require("../models");
const { Op } = require("sequelize");
const event = require("../models/event");

async function crearEvento(data) {
  return await Event.create(data);
}

async function editarEvento(id, data) {
  const evento = await Event.findByPk(id);
  if (!evento) return null;
  await evento.update(data);
  return evento;
}

async function listarEventos() {
  return await Event.findAll({
    include: [{ model: User, as: "organizer", attributes: ["id", "nombre", "email"] }]
  });
}

async function obtenerEvento(id) {
  return await Event.findByPk(id, {
    include: [{ model: User, as: "organizer", attributes: ["id", "nombre", "email"] }],
  });
}

async function obtenerInscritos(id) {
  return await Registration.findAll({
    where: { eventId: id },
    include: [{ model: User, attributes: ["id", "nombre", "email"] }],
  });
}

async function obtenerReporte(id, from, to) {
  const eventWhere = { id };
  if (from || to) {
    const dateRange = {};
    if (from) {
      const fromDate = new Date(from);
      fromDate.setHours(0, 0, 0, 0);
      dateRange[Op.gte] = fromDate;
    }
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      dateRange[Op.lte] = toDate;
    }
    eventWhere.dateTime = dateRange; // 👈 filtrar por fecha del evento
  }

  const evento = await Event.findOne({ where: eventWhere });
  if (!evento) return { inscritos: 0, asistentes: 0, cuposLibres: 0 };

  const inscritos = await Registration.count({
    where: { eventId: evento.id, status: { [Op.in]: ["pending", "accepted"] } }
  });

  const asistentes = await Registration.count({
    where: { eventId: evento.id, estadoIngreso: "checked" }
  });

  const cuposLibres = evento.capacity - inscritos;

  return { inscritos, asistentes, cuposLibres };
}

async function eliminarEvento(id) {
  const evento = await Event.findByPk(id);
  if (!evento) return null;
  await evento.destroy();
  return evento;
}

module.exports = {
  crearEvento,
  editarEvento,
  listarEventos,
  obtenerEvento,
  obtenerInscritos,
  obtenerReporte,
  eliminarEvento,
};
