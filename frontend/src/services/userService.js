import api from "../services/api.js";

// Obtener todos los usuarios
export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

// Crear un nuevo usuario (solo admin)
export const createUser = async (userData) => {
  const res = await api.post("/admin/crear-usuario", userData); // coincide con tu ruta backend
  return res.data;
};

// Actualizar datos de usuario (nombre, email, rol)
export const updateUser = async (id, data) => {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
};

// Cambiar contraseña de usuario
export const changePassword = async (id, password) => {
  const res = await api.put(`/users/${id}/password`, { password });
  return res.data;
};

// Eliminar usuario
export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};
