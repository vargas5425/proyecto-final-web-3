import React, { useEffect, useState } from "react";
import { getEvents, registerEvent } from "../../services/eventService.js";
import { useNavigate } from "react-router-dom";
import EventCard from "../../components/EventCard.jsx";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getEvents().then(setEvents).catch(console.error);
  }, []);

  const handleRegister = async (eventId) => {
    try {
      await registerEvent(eventId);
      alert("Inscripción realizada con éxito. Revisa tu QR en 'Mis Inscripciones'.");
    } catch (err) {
      alert("Error al inscribirse: " + (err.response?.data?.mensaje || ""));
    }
  };

  return (
    <div className="position-absolute top-0 start-0 w-100 min-vh-100 bg-dark text-white">
      <div className="container py-4 mt-5">
        
        <h4 className="mb-4">Eventos disponibles</h4>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {events.map((event) => (
            <div key={event.id} className="col d-flex">
              <div className="w-100 h-100 d-flex flex-column">

                {/* Card reutilizable */}
                <EventCard 
                  event={event} 
                  isParticipant={true}
                  onRegister={() => handleRegister(event.id)}
                  onViewDetails={() => navigate(`/participant/event/${event.id}`)}
                />

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
