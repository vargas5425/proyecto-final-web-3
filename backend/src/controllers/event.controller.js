// controllers/eventController.js
const eventService = require("../services/eventService");

module.exports = {
  crear: async (req, res) => {
    try {
      const { titulo, descripcion, fechaHora, lugar, capacidad, lat, lng, precio } = req.body;
      if (!titulo || !fechaHora || !lugar || !capacidad || lat == null || lng == null) {
        return res.status(400).json({ mensaje: "Faltan datos obligatorios o coordenadas." });
      }

      const rutaAfiche = req.file ? `uploads/afiches/${req.file.filename}` : null;
      const precioValue = (precio === undefined || precio === "") ? null : Number(precio);

      const evento = await eventService.crearEvento({
        title: titulo,
        description: descripcion,
        dateTime: fechaHora,
        location: lugar,
        capacity: capacidad,
        organizerId: req.user?.id || null,
        posterPath: rutaAfiche,
        lat,
        lng,
        precio: precioValue,
      });

      res.json({ mensaje: "Evento creado correctamente.", evento });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al crear evento." });
    }
  },

  editar: async (req, res) => {
    try {
      const evento = await eventService.editarEvento(req.params.id, req.body);
      if (!evento) return res.status(404).json({ mensaje: "Evento no encontrado." });
      res.json({ mensaje: "Evento actualizado correctamente.", evento });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al editar evento." });
    }
  },

  listar: async (req, res) => {
    try {
      const eventos = await eventService.listarEventos();
      res.json(eventos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al listar eventos." });
    }
  },

  obtenerUno: async (req, res) => {
    try {
      const evento = await eventService.obtenerEvento(req.params.id);
      if (!evento) return res.status(404).json({ mensaje: "Evento no encontrado." });
      res.json(evento);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al obtener evento." });
    }
  },

  obtenerInscritos: async (req, res) => {
    try {
      const inscritos = await eventService.obtenerInscritos(req.params.id);
      res.json(inscritos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al obtener inscritos." });
    }
  },

  obtenerReporte: async (req, res) => {
    try {
      const reporte = await eventService.obtenerReporte(req.params.id, req.query.from, req.query.to);
      res.json(reporte);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al generar reporte." });
    }
  },

  eliminar: async (req, res) => {
    try {
      const evento = await eventService.eliminarEvento(req.params.id);
      if (!evento) return res.status(404).json({ mensaje: "Evento no encontrado." });
      res.json({ mensaje: "Evento eliminado correctamente." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al eliminar evento." });
    }
  },
};
