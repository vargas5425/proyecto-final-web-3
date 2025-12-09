import React, { useEffect, useState } from "react";
import { getEvents } from "../../services/eventService.js";
import EventCard from "../../components/EventCard.jsx";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getEvents().then(setEvents).catch(console.error);
  }, []);

  return (
    <div className="position-absolute top-0 start-0 w-100 min-vh-100 bg-dark text-white">
    <div className="container my-4 pt-4 mt-5">
      <h2 className="mb-4">Próximos Eventos</h2>
      <div className="row g-3">
        {events.map((event) => (
          <div key={event.id} className="col-sm-6 col-md-4">
            <EventCard 
              event={event} 
              isPublic={true}
              onViewDetails={() => navigate(`/event/${event.id}`)}
            />
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
