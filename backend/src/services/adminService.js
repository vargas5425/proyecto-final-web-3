const { User, Role } = require("../models");
const { hashPassword } = require("../utils/cryptoUtils");

async function crearUsuarioConRol({ nombre, email, password, role, userRole }) {

  if (!nombre || !email || !password || !role) {
    throw new Error("Faltan datos.");
  }

  if (role === "participant") {
    throw new Error("No se puede crear usuarios tipo participant.");
  }

  // Verificar que el usuario que hace la petición sea admin
  if (userRole !== "admin") {
    const err = new Error("No autorizado.");
    err.statusCode = 403;
    throw err;
  }

  // Verificar que el rol solicitado exista
  const rolEncontrado = await Role.findOne({ where: { name: role } });
  if (!rolEncontrado) {
    throw new Error("Rol inválido.");
  }

  const existente = await User.findOne({ where: { email } });
  if (existente) {
    throw new Error("El correo ya está en uso.");
  }

  // Crear usuario con hash de contraseña y rol asignado
  const nuevoUsuario = await User.create({
    nombre,
    email,
    passwordHash: hashPassword(password),
    roleId: rolEncontrado.id,
  });

  return {
    id: nuevoUsuario.id,
    nombre: nuevoUsuario.nombre,
    email: nuevoUsuario.email,
    role: rolEncontrado.name,
  };
}

module.exports = { crearUsuarioConRol };
