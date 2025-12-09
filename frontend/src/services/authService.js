import api from "./api";

export const login = async ({ email, password }) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const register = async ({ nombre, email, password }) => {
  const res = await api.post("/auth/register", { nombre, email, password });
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/auth/perfil");
  return res.data;
};