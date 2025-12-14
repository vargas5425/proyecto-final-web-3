import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, registerEvent } from "../../services/eventService.js";
import { useAuth } from "../../hooks/useAuth.js";
import MapPicker from "../../components/MapPicker.jsx";
import AlertModal from "../../components/alertModal.jsx";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [alertData, setAlertData] = useState({ show: false, title: "", message: "" });
              
  const showAlert = (title, message) => {
    setAlertData({ show: true, title, message });
  };

  useEffect(() => {
    getEventById(id).then(setEvent).catch(console.error);
  }, [id]);

  if (!event) return <div className="alert alert-secondary">Cargando evento...</div>;

  const posterUrl = `http://localhost:4000/${event.posterPath.replace(/\\/g, "/")}`;
  const mapsLink =
    event.lat && event.lng
      ? `https://www.google.com/maps?q=${event.lat},${event.lng}`
      : null;

  const handleInscripcion = async () => {
    if (!user) 
      return 
        navigate("/login");

    try {
      await registerEvent(event.id);
      showAlert("Éxito", "Inscripción realizada con éxito.");
    } catch (err) {
      showAlert("Error", "Error: " + (err.response?.data?.mensaje || ""));
    }
  };

  return (
    <div className="position-absolute top-0 start-0 w-100 min-vh-100 bg-dark text-white">
      <div className="container my-4 pt-5">
        <div className="card d-flex flex-row">
          {/* Imagen a la izquierda */}
          {posterUrl && (
            <div style={{ flex: "1 1 40%", maxHeight: "300px", overflow: "hidden" }}>
              <img
                src={posterUrl}
                alt={event.title}
                className="w-100 h-100 rounded"
                style={{ objectFit: "cover" }}
              />
            </div>
          )}

          {/* Contenido a la derecha */}
          <div className="card-body flex-grow-1">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h3 className="card-title">{event.title}</h3>
              <small className="text-muted">
                {event.precio != null && Number(event.precio) > 0
                  ? `$${Number(event.precio).toFixed(2)}`
                  : "Gratis"}
              </small>
            </div>

            <p className="card-text">{event.description}</p>

            <p className="text-muted">
              {new Date(event.dateTime).toLocaleDateString()}
            </p>
            <p className="text-muted mb-4">
              {new Date(event.dateTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <p className="text-muted">
              {event.location}{" "}
              {mapsLink && (
                <a href={mapsLink} target="_blank" rel="noreferrer">
                  Ver en mapa
                </a>
              )}
            </p>

            <div className="mt-3">
              <button className="btn btn-primary" onClick={handleInscripcion}>
                Inscribirme
              </button>
            </div>
          </div>
        </div>

        {/* Mapa con marcador en modo solo lectura */}
        {event.lat && event.lng && (
          <div className="mt-4">
            <MapPicker
              lat={event.lat}
              lng={event.lng}
              setLat={() => {}}
              setLng={() => {}}
              setLugar={() => {}}
              height={400}
              readOnly={true}
            />
          </div>
        )}
      </div>
        <AlertModal
            show={alertData.show}
            title={alertData.title}
            message={alertData.message}
            onClose={() => setAlertData({ ...alertData, show: false })}
        />
    </div>
  );
}
