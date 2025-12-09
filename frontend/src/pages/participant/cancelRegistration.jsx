import React, { useEffect, useState } from "react";
import { getMyRegistrations, cancelRegistration } from "../../services/registrationService.js";

export default function CancelRegistration() {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    getMyRegistrations().then(setRegistrations).catch(console.error);
  }, []);

  const handleCancel = async (id) => {
    try {
      await cancelRegistration(id);
      alert("Inscripción cancelada");
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.response?.data?.mensaje || "Error al cancelar inscripción.");
    }
  };

  return (
  <div className="position-absolute top-0 start-0 w-100 min-vh-100 bg-dark text-white">
    <div className="container my-4 pt-4 mt-5">
      <h2 className="mb-3">Cancelar Inscripción</h2>
      {registrations.length === 0 && (
        <div className="alert alert-secondary">No tienes inscripciones activas.</div>
      )}

      <div className="list-group">
        {registrations.map((reg) => (
          <div key={reg.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">{reg.eventTitle}</h5>
            </div>
            <button className="btn btn-outline-danger btn-sm" onClick={() => handleCancel(reg.id)}>Cancelar inscripción</button>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
}
