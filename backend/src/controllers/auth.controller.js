// controllers/auth.controller.js
const authService = require("../services/authService");

module.exports = {
  registrar: async (req, res) => {
    try {
      const { nombre, email, password } = req.body;
      const usuario = await authService.registrarUsuario({ nombre, email, password });

      return res.json({
        mensaje: "Usuario registrado correctamente.",
        usuario,
      });
    } catch (error) {
      console.error(error);
      const status = error.statusCode || 500;
      return res.status(status).json({ mensaje: error.message || "Error en el servidor." });
    }
  },

  iniciarSesion: async (req, res) => {
    try {
      const { email, password } = req.body;
      const { token, usuario } = await authService.iniciarSesion({ email, password });

      return res.json({
        mensaje: "Bienvenido.",
        token,
        usuario,
      });
    } catch (error) {
      console.error(error);
      const status = error.statusCode || 500;
      return res.status(status).json({ mensaje: error.message || "Error en el servidor." });
    }
  },

  perfil: async (req, res) => {
    try {
      const usuario = await authService.obtenerPerfil(req.user.id);
      return res.json(usuario);
    } catch (error) {
      console.error(error);
      const status = error.statusCode || 500;
      return res.status(status).json({ mensaje: error.message || "Error en el servidor." });
    }
  },
};
