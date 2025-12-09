// controllers/user.controller.js
const userService = require("../services/userService");

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await userService.listarUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ mensaje: error.message || "Error al listar usuarios" });
  }
};

exports.actualizarUsuario = async (req, res) => {
  try {
    const result = await userService.actualizarUsuario(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ mensaje: error.message || "Error al actualizar usuario" });
  }
};

exports.cambiarContrasena = async (req, res) => {
  try {
    const result = await userService.cambiarContrasena(req.params.id, req.body.password);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ mensaje: error.message || "Error al cambiar contraseña" });
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    const result = await userService.eliminarUsuario(req.params.id);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ mensaje: error.message || "Error al eliminar usuario" });
  }
};
