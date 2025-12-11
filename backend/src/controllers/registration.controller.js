const registrationService = require("../services/registrationService");

module.exports = {
  // -----------------------------------------------
  // INSCRIBIRSE A UN EVENTO
  // -----------------------------------------------
  inscribirse: async (req, res) => {
    try {
      const result = await registrationService.inscribirse(req.user.id, req.params.eventoId);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ mensaje: error.message || "Error al inscribirse." });
    }
  },

  // -----------------------------------------------
  // SUBIR COMPROBANTE
  // -----------------------------------------------
  subirComprobante: async (req, res) => {
    try {
      const result = await registrationService.subirComprobante(req.user.id, req.params.eventoId, req.file);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ mensaje: error.message || "Error al subir comprobante." });
    }
  },

  // -----------------------------------------------
  // GENERAR TOKEN Y QR
  // -----------------------------------------------
  generarQR: async (req, res) => {
    try {
      const result = await registrationService.generarQR(req.params.registroId);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ mensaje: error.message || "Error al generar QR." });
    }
  },

  // -----------------------------------------------
  // LISTAR INSCRIPCIONES DEL USUARIO LOGUEADO
  // -----------------------------------------------
  getMyRegistrations: async (req, res) => {
    try {
      const result = await registrationService.getMyRegistrations(req.user.id);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ mensaje: error.message || "Error al obtener inscripciones." });
    }
  },

  // -----------------------------------------------
  // LISTAR INSCRIPCIONES DE UN EVENTO
  // -----------------------------------------------
  getRegistrationsByEvent: async (req, res) => {
    try {
      const result = await registrationService.getRegistrationsByEvent(req.params.eventId, req.user?.Role?.name);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ mensaje: error.message || "Error al obtener inscripciones del evento." });
    }
  },

  // -----------------------------------------------
  // CANCELAR INSCRIPCION
  // -----------------------------------------------
  cancelRegistration: async (req, res) => {
    try {
      const result = await registrationService.cancelRegistration(req.params.registroId, req.user);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ mensaje: error.message || "Error al cancelar inscripción." });
    }
  },

  // -----------------------------------------------
  // VALIDAR COMPROBANTE
  // -----------------------------------------------
  validateComprobante: async (req, res) => {
    try {
      const result = await registrationService.validateComprobante(req.params.registroId, req.body.status, req.user?.Role?.name);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ mensaje: error.message || "Error al validar comprobante." });
    }
  },

  // -----------------------------------------------
  // ELIMINAR INSCRITO
  // -----------------------------------------------
  deleteRegistration: async (req, res) => {
    try {
      const result = await registrationService.deleteRegistration(req.params.registroId, req.user?.Role?.name);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ mensaje: error.message || "Error al eliminar inscrito." });
    }
  },
};
