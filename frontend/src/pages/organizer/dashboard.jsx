import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents, deleteEvent } from "../../services/eventService.js";
import EventCard from "../../components/EventCard.jsx";

export default function Dashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      setEvents(events.filter((e) => e.id !== id));
    } catch {
      alert("Error al borrar evento");
    }
  };

  return (
    <div className="position-absolute top-0 start-0 w-100 min-vh-100 bg-dark text-white">
      <div className="container my-4 mt-5 pt-4">
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="m-0">Eventos</h3>
          <Link to="/organizer/crear-evento">
            <button className="btn btn-success">Crear Nuevo Evento</button>
          </Link>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {events.map((ev) => (
            <div key={ev.id} className="col d-flex">
              <div className="w-100 h-100 d-flex flex-column">

                  <EventCard 
                  event={ev} 
                  isOrganizer={true} 
                  onDelete={() => handleDelete(ev.id)}
                  />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
