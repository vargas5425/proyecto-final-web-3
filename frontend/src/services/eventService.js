import api from "../services/api.js"; // instancia de axios con token

export const getEvents = async () => {
  const res = await api.get("/events");
  return res.data; // lista de eventos
};

export const getEventById = async (id) => {
  const res = await api.get(`/events/${id}`);
  return res.data; // detalle de evento
};

export const registerEvent = async (eventId) => {
  const res = await api.post(`/registrations/${eventId}/inscribirse`);
  return res.data;
};


/*export const createEvent = async (data) => {
  const res = await api.post("/events", data);
  return res.data;
};*/

export const createEvent = async (formData) => {
  const res = await api.post("/events", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

export const deleteEvent = async (id) => {
  const res = await api.delete(`/events/${id}`);
  return res.data;
};

export const getEventReport = async (eventId, params = {}) => {
  const res = await api.get(`/events/${eventId}/report`, { params });
  return res.data;
};

export const updateEvent = async (id, formData) => {
  const res = await api.put(`/events/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

