import React, { useEffect, useState } from "react";
import { getEventReport, getEvents } from "../../services/eventService.js";
import { useAuth } from "../../hooks/useAuth.js";

export default function Reports() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [report, setReport] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  // -------------------------------
  // Obtener eventos
  // -------------------------------
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const list = await getEvents();
        const filtered = user?.rol === "organizer"
          ? list.filter(e => e.organizer?.id === user.id)
          : list;
        setEvents(filtered);
        if (filtered.length && !selectedEventId) setSelectedEventId(filtered[0].id);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, [user, selectedEventId]);

  // -------------------------------
  // Obtener reporte cuando cambian eventId o filtros
  // -------------------------------
  useEffect(() => {
    if (!selectedEventId) return;

    const fetchReport = async () => {
      setLoading(true);
      try {
        const params = {};
        if (fromDate) params.from = fromDate;
        if (toDate) params.to = toDate;
        const data = await getEventReport(selectedEventId, params);
        setReport(data);
      } catch (err) {
        console.error(err);
        setReport(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [selectedEventId, fromDate, toDate]);

  return (
  <div className="position-absolute top-0 start-0 w-100 min-vh-100 bg-dark text-white">
    <div className="container my-4 pt-5">
      <h2 className="mb-3">Reporte del Evento</h2>

      <div className="row mb-3">
        <div className="col-md-4">
          <select
            className="form-select"
            value={selectedEventId}
            onChange={e => setSelectedEventId(e.target.value)}
          >
            <option value="">-- Seleccione un evento --</option>
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>{ev.title}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-primary"
            onClick={() => {}}
            disabled={loading || !selectedEventId}
          >
            {loading ? "Cargando..." : "Filtrar"}
          </button>
        </div>
      </div>

      {report ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Inscritos</th>
              <th>Asistentes</th>
              <th>Cupos libres</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{report.inscritos}</td>
              <td>{report.asistentes}</td>
              <td>{report.cuposLibres}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <div className="alert alert-secondary">No hay datos</div>
      )}
    </div>
    </div>
  );
}
