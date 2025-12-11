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
  const where = { eventId: id };
  if (from || to) {
    const createdAt = {};
    if (from) createdAt[Op.gte] = new Date(from);
    if (to) {
      const toDate = new Date(to);
      if (/^\d{4}-\d{2}-\d{2}$/.test(to)) {
        toDate.setHours(23, 59, 59, 999);
      }
      createdAt[Op.lte] = toDate;
    }
    where.createdAt = createdAt;
  }

  // Solo cuentan como inscritos los estados activos
  const inscritos = await Registration.count({
    where: { ...where, status: { [Op.in]: ["pending", "accepted"] } }
  });

  const asistentes = await Registration.count({
    where: { ...where, estadoIngreso: "checked" }
  });

  const evento = await Event.findByPk(id);
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
