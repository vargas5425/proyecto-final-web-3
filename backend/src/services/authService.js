// services/authService.js
const { User, Role } = require("../models");
const { hashPassword } = require("../utils/cryptoUtils");
const jwt = require("jsonwebtoken");

async function registrarUsuario({ nombre, email, password }) {
  if (!nombre || !email || !password) {
    const err = new Error("Faltan datos.");
    err.statusCode = 400;
    throw err;
  }

  const rolParticipante = await Role.findOne({ where: { name: "participant" } });
  if (!rolParticipante) {
    const err = new Error("Error de configuración del sistema.");
    err.statusCode = 500;
    throw err;
  }

  const existente = await User.findOne({ where: { email } });
  if (existente) {
    const err = new Error("El correo ya está en uso.");
    err.statusCode = 400;
    throw err;
  }

  const passwordHash = hashPassword(password);

  const nuevoUsuario = await User.create({
    nombre,
    email,
    passwordHash,
    roleId: rolParticipante.id,
  });

  return {
    id: nuevoUsuario.id,
    nombre,
    email,
    rol: rolParticipante.name,
  };
}

async function iniciarSesion({ email, password }) {
  const usuario = await User.findOne({
    where: { email },
    include: Role,
  });

  if (!usuario) {
    const err = new Error("Credenciales inválidas.");
    err.statusCode = 400;
    throw err;
  }

  const hashComparado = hashPassword(password);
  if (hashComparado !== usuario.passwordHash) {
    const err = new Error("Credenciales inválidas.");
    err.statusCode = 400;
    throw err;
  }

  const token = jwt.sign(
    { id: usuario.id },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  const rolUsuario = usuario.Role?.name || "participant";

  return {
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: rolUsuario,
    },
  };
}

async function obtenerPerfil(userId) {
  const usuario = await User.findByPk(userId, { include: Role });
  if (!usuario) {
    const err = new Error("Usuario no encontrado.");
    err.statusCode = 404;
    throw err;
  }

  return {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.Role.name,
  };
}

module.exports = {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfil,
};
