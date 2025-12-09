import api from "../services/api.js";

export const getMyRegistrations = async () => {
  const res = await api.get("/registrations/mine");
  return res.data;
};

export const cancelRegistration = async (id) => {
  const res = await api.delete(`/registrations/${id}`);
  return res.data;
};

export const getRegistrationsByEvent = async (eventId) => {
  const res = await api.get(`/registrations/event/${eventId}`);
  return res.data;
};

export const validateComprobante = async (id, status) => {
  const res = await api.put(`/registrations/${id}/validate`, { status });
  return res.data;
};

// Subir comprobante
export const uploadComprobante = async (eventoId, file) => {
  const formData = new FormData();
  formData.append("comprobante", file);

  const res = await api.post(`/registrations/${eventoId}/comprobante`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};


