import React, { useEffect, useState } from "react";
import { getMyRegistrations, uploadComprobante } from "../../services/registrationService.js";
import QRCodeViewer from "../../components/QRCodeViewer.jsx";

export default function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);
  const [file, setFile] = useState(null);

  const fetchRegistrations = () => {
    getMyRegistrations().then(setRegistrations).catch(console.error);
  };

useEffect(() => {
  fetchRegistrations();
}, []);

  const openModal = (reg) => {
    setSelectedReg(reg);
    setShowModal(true);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Selecciona un archivo.");

    try {
      await uploadComprobante(selectedReg.eventId, file);
      alert("Comprobante subido correctamente.");
      setShowModal(false);
      setFile(null);
      fetchRegistrations();
    } catch (err) {
      alert("Error al subir el comprobante: " + (err.response?.data?.mensaje || err.message));
    }
  };

  return (
  <div className="position-absolute top-0 start-0 w-100 min-vh-100 bg-dark text-white">
    <div className="container my-4 pt-4 mt-5">
      <h2 className="text-center text-primary mb-4">Mis Inscripciones</h2>

      {registrations.length === 0 && (
        <div className="alert alert-secondary text-center">
          No tienes inscripciones registradas.
        </div>
      )}

      <div className="row g-3">
        {registrations.map((reg) => (
          <div key={reg.id} className="col-12 col-md-6">
            <div className="card mb-3 p-3">
              <div className="d-flex justify-content-between align-items-start">
                <h5 className="card-title">{reg.eventTitle}</h5>
                <small className="text-muted">{reg.precio != null && Number(reg.precio) > 0 ? `$${Number(reg.precio).toFixed(2)}` : "Gratis"}</small>
              </div>
              <p>Estado: <strong>{reg.status}</strong></p>

              {reg.status === "accepted" && reg.qrUrl && (
                <div className="mb-2">
                  <QRCodeViewer url={reg.qrUrl} />
                </div>
              )}

              {reg.precio > 0 && reg.status === "pending" && (
                reg.paymentProofPath ? (
                  <p className="text-muted fst-italic">
                    Espera la validación del organizador.
                  </p>
                ) : (
                  <button className="btn btn-primary" onClick={() => openModal(reg)}>
                    Subir Comprobante de Pago
                  </button>
                )
              )}

              {reg.status === "rejected" && (
                <p className="text-danger">Tu inscripción fue rechazada.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <>
          <div className="modal-backdrop show" onClick={() => setShowModal(false)} />
          <div className="modal show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Subir Comprobante de Pago</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)} />
                </div>
                <form onSubmit={handleUpload}>
                  <div className="modal-body">
                    <input className="form-control" type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files[0])} />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-success">Subir</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
  );
}
