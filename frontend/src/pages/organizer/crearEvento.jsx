import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createEvent, getEventById, updateEvent } from "../../services/eventService.js";
import MapPicker from "../../components/MapPicker.jsx";

export default function CrearEvento() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaHora, setFechaHora] = useState("");
  const [lugar, setLugar] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [afiche, setAfiche] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setTimeout(() => setLoading(true), 0);

    getEventById(id)
      .then((evt) => {
        if (!mounted) return;
        setTitulo(evt.title || "");
        setDescripcion(evt.description || "");
        if (evt.dateTime) {
          const dt = new Date(evt.dateTime);
          const pad = (n) => String(n).padStart(2, "0");
          const formatted = `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
          setFechaHora(formatted);
        }
        setLugar(evt.location || "");
        setCapacidad(evt.capacity ?? "");
        setPrecio(evt.precio ?? "");
        setLat(evt.lat ?? "");
        setLng(evt.lng ?? "");
      })
      .catch((err) => console.error("Error cargando evento:", err))
      .finally(() => setLoading(false));

    return () => { mounted = false };
  }, [id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", titulo);
    formData.append("description", descripcion);
    formData.append("dateTime", fechaHora);
    formData.append("location", lugar);
    formData.append("capacity", capacidad);
    formData.append("lat", lat);
    formData.append("lng", lng);
    formData.append("precio", precio);
    if (afiche) formData.append("afiche", afiche);

    try {
      if (id) {
        await updateEvent(id, formData);
        alert("Evento actualizado correctamente");
      } else {
        await createEvent(formData);
        alert("Evento creado correctamente");
      }
      navigate("/organizer");
    } catch (err) {
      alert("Error al crear evento: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="position-absolute top-0 start-0 w-100 min-vh-100 bg-dark text-white">
    <div className="container my-5 pt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-lg bg-light p-4">
            <div className="card-body">

              <h3 className="card-title mb-4 text-center">
                {id ? "Editar Evento" : "Crear Nuevo Evento"}
              </h3>

              {loading && <div className="alert alert-secondary">Cargando evento...</div>}

              <form onSubmit={handleCreate} encType="multipart/form-data">

                <div className="mb-3">
                  <label className="form-label">Título</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Ingrese el título del evento"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    placeholder="Ingrese la descripción del evento"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Fecha y Hora</label>
                  <input
                    className="form-control"
                    type="datetime-local"
                    value={fechaHora}
                    onChange={(e) => setFechaHora(e.target.value)}
                    required
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Capacidad</label>
                    <input
                      className="form-control"
                      type="number"
                      placeholder="Cantidad de participantes"
                      value={capacidad}
                      onChange={(e) => setCapacidad(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Lugar</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Nombre del lugar"
                      value={lugar}
                      onChange={(e) => setLugar(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Precio de entrada</label>
                    <input
                      className="form-control"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0 (dejar vacío para sin precio)"
                      value={precio}
                      onChange={(e) => setPrecio(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Ubicación en el mapa</label>
                  <MapPicker
                    lat={lat}
                    lng={lng}
                    setLat={setLat}
                    setLng={setLng}
                    setLugar={setLugar}
                    height={300}
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Latitud</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Latitud"
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Longitud</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Longitud"
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Afiche (imagen)</label>
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAfiche(e.target.files[0])}
                  />
                </div>

                {/* BOTONES FINAL */}
                  <div className="d-flex justify-content-start gap-2 mt-4">
                    <button type="submit" className="btn btn-primary">
                      {id ? "Actualizar Evento" : "Crear Evento"}
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate("/organizer")}
                    >
                      Cancelar
                    </button>
                  </div>


              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
