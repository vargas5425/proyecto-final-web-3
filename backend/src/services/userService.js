// services/userService.js
const { User, Role } = require("../models");
const { hashPassword } = require("../utils/cryptoUtils");

async function listarUsuarios() {
  const usuarios = await User.findAll({
    include: { model: Role, attributes: ["name"] },
    attributes: ["id", "nombre", "email"],
  });

  return usuarios.map(u => ({
    id: u.id,
    nombre: u.nombre,
    email: u.email,
    role: u.Role?.name,
    puedeEditar: u.Role?.name !== "participant",
  }));
}

async function actualizarUsuario(id, { nombre, email, role }) {
  const usuario = await User.findByPk(id, { include: Role });
  if (!usuario) throw { statusCode: 404, message: "Usuario no encontrado" };

  if (usuario.Role?.name === "participant") {
    throw { statusCode: 403, message: "No puedes editar un participant" };
  }

  if (role) {
    const rolEncontrado = await Role.findOne({ where: { name: role } });
    if (!rolEncontrado) throw { statusCode: 400, message: "Rol inválido" };
    usuario.roleId = rolEncontrado.id;
  }

  if (nombre) usuario.nombre = nombre;
  if (email) usuario.email = email;

  await usuario.save();
  return { mensaje: "Usuario actualizado" };
}

async function cambiarContrasena(id, password) {
  if (!password) throw { statusCode: 400, message: "Contraseña requerida" };

  const usuario = await User.findByPk(id, { include: Role });
  if (!usuario) throw { statusCode: 404, message: "Usuario no encontrado" };

  if (usuario.Role?.name === "participant") {
    throw { statusCode: 403, message: "No puedes cambiar contraseña de un participant" };
  }

  usuario.passwordHash = hashPassword(password);
  await usuario.save();

  return { mensaje: "Contraseña actualizada" };
}

async function eliminarUsuario(id) {
  const usuario = await User.findByPk(id);
  if (!usuario) throw { statusCode: 404, message: "Usuario no encontrado" };

  await usuario.destroy();
  return { mensaje: "Usuario eliminado" };
}

module.exports = {
  listarUsuarios,
  actualizarUsuario,
  cambiarContrasena,
  eliminarUsuario,
};
