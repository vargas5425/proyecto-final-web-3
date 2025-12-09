import React from "react"; 
import { Link } from "react-router-dom";

export default function EventCard({
  event,
  isOrganizer = false,
  isParticipant = false,
  isPublic = false,
  onDelete,
  onRegister,
  onViewDetails
}) {
  const posterUrl = `http://localhost:4000/${event.posterPath.replace(/\\/g, "/")}`;

  return (
    <div className="card h-100 d-flex flex-column">
      
      {/* Imagen */}
      <div style={{ height: "400px", overflow: "hidden" }}>
        <img 
          src={posterUrl} 
          className="card-img-top w-100 h-100" 
          alt={event.title}
          style={{ objectFit: "cover" }}
        />
      </div>
      
      <div className="card-body d-flex flex-column">

        <div className="d-flex justify-content-between align-items-start">
          <h5 className="card-title">{event.title}</h5>
          <small className="text-muted">
            {event.precio != null && Number(event.precio) > 0 
              ? `$${Number(event.precio).toFixed(2)}`
              : "Gratis"}
          </small>
        </div>

        <p className="card-text mb-2 flex-grow-1">
          {event.description.substring(0, 60)}...
        </p>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <p className="text-muted mb-0">
              {new Date(event.dateTime).toLocaleDateString()}
            </p>
            <p className="text-muted mb-0">
              {new Date(event.dateTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
          </div>

          {/* Botones para organizador */}
          {isOrganizer && (
            <div className="d-flex flex-column gap-2">
              <button
                className="btn btn-danger w-100"
                onClick={onDelete}
              >
                Eliminar
              </button>

              <Link
                to={`/organizer/crear-evento/${event.id}`}
                className="btn btn-secondary w-100"
              >
                Editar
              </Link>

              <Link
                to={`/organizer/manage-registrations/${event.id}`}
                className="btn btn-info w-100"
              >
                Inscritos
              </Link>
            </div>
          )}

          {/* Botones para participante */}
          {isParticipant && (
            <div className="d-flex flex-column gap-2">
              <button
                className="btn btn-outline-info w-100"
                onClick={onViewDetails}
              >
                Ver detalles
              </button>

              <button
                className="btn btn-primary w-100"
                onClick={onRegister}
              >
                Inscribirme
              </button>
            </div>
          )}

          {/* Botones para público */}
          {isPublic && (
            <div className="d-flex flex-column gap-2">
              <button
                className="btn btn-primary w-100"
                onClick={onViewDetails}
              >
                Ver detalles
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
