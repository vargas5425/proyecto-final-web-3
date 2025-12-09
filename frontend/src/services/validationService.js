import api from "../services/api.js";

export const validateQR = async (token) => {
  const res = await api.post("/validate", { token });
  return res.data; // { participantName, status }
};
