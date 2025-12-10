import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, registerEvent } from "../../services/eventService.js";
import { useAuth } from "../../hooks/useAuth.js";
import MapPicker from "../../components/MapPicker.jsx";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    getEventById(id).then(setEvent).catch(console.error);
  }, [id]);

  if (!event) return <div className="alert alert-secondary">Cargando evento...</div>;

  const posterUrl = `http://localhost:4000/${event.posterPath?.replace(/\\/g, "/")}`;
  const mapsLink =
    event.lat && event.lng
      ? `https://www.google.com/maps?q=${event.lat},${event.lng}`
      : null;

  const handleInscripcion = async () => {
    if (!user) return navigate("/login");

    try {
      await registerEvent(event.id);
        alert("Inscripción realizada con éxito.");
    } catch (err) {
      alert("Error: " + (err.response?.data?.mensaje || ""));
    }
  };

  return (
    <div className="position-absolute top-0 start-0 w-100 min-vh-100 bg-dark text-white">
      <div className="container my-4">
        <div className="card">
          {posterUrl && <img src={posterUrl} className="card-img-top" alt={event.title} />}
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
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
    </div>
  );
}

