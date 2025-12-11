const qrService = require("../services/validationService");

module.exports = {
  validarQR: async (req, res) => {
    try {
      const token = req.query.token || req.body.token;
      const result = await qrService.validarQR(token);
      res.json(result);
    } catch (error) {
      console.error("ERROR VALIDANDO QR:", error);
      res.status(error.statusCode || 500).json({
        mensaje: error.message || "Error al validar QR",
        status: error.status || "error",
      });
    }
  },
};
