import React, { useEffect, useState } from "react";
import { getMyRegistrations, cancelRegistration } from "../../services/registrationService.js";
import AlertModal from "../../components/alertModal.jsx";

export default function CancelRegistration() {
  const [registrations, setRegistrations] = useState([]);
  const [alertData, setAlertData] = useState({ show: false, title: "", message: "" });
        
  const showAlert = (title, message) => {
    setAlertData({ show: true, title, message });
  };

  useEffect(() => {
    getMyRegistrations().then(setRegistrations).catch(console.error);
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("¿Eliminar esta inscripción?")) return;
    try {
      await cancelRegistration(id);
      showAlert("Éxito", "Inscripción cancelada");
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      showAlert("Error", err.response?.data?.mensaje || "Error al cancelar inscripción.");
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
        <AlertModal
            show={alertData.show}
            title={alertData.title}
            message={alertData.message}
            onClose={() => setAlertData({ ...alertData, show: false })}
        />
  </div>
  );
}
