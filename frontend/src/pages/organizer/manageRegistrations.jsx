import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRegistrationsByEvent, validateComprobante, cancelRegistration } from "../../services/registrationService.js";

export default function ManageRegistrations({ eventId: propEventId }) {
  const params = useParams();
  const eventId = propEventId || params.eventId;
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(true);

  useEffect(() => {
    getRegistrationsByEvent(eventId)
      .then((data) => setRegistrations(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [eventId]);

  const openComprobanteModal = (path) => {
    setSelectedImage(path);
    setModalOpen(true);
  };

  const closeComprobanteModal = () => {
    setSelectedImage(null);
    setModalOpen(false);
  };

  const handleValidation = async (id, status) => {
  try {
    const reg = registrations.find((r) => r.id === id);
    const response = await validateComprobante(id, status);

    setRegistrations((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: response.registro?.status || status } : r
      )
    );

    if (status === "rejected") {
      localStorage.setItem(
        "rejectedEvent",
        JSON.stringify({ eventTitle: reg.eventTitle, eventId: reg.eventId })
      );
      alert("Inscripción rechazada correctamente. El participante puede volver a inscribirse.");
    } else {
      alert("Inscripción aceptada correctamente.");
    }
  } catch (err) {
    console.error(err);
    alert("Error al procesar la inscripción: " + (err.response?.data?.mensaje || err.message));
  }
};


  const handleCancel = async (id) => {
    if (!confirm("¿Eliminar esta inscripción?")) return;
    try {
      await cancelRegistration(id);
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
      alert("Inscripción eliminada.");
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la inscripción: " + (err.response?.data?.mensaje || err.message));
    }
  };

  // ------------------------------------------------
  // descargar WORD
  // ------------------------------------------------

const downloadWord = () => {
  if (!registrations.length) return;

  const eventTitle = registrations[0]?.eventTitle || "Evento sin título";

  const headers = ["Nombre", "Email", "Estado", "Token de validación", "Ingreso"];
  const rows = registrations.map(r => [
    r.User?.nombre,
    r.User?.email,
    r.status,
    r.tokenValidacion,
    r.estadoIngreso,
  ]);

  let htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 2cm;
          margin-left: 1cm;
        }
        h2 {
          text-align: center;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #000;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
      </style>
    </head>
    <body>
      <h2>Lista de inscritos - ${eventTitle}</h2>
      <table>
        <tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>
        ${rows.map(row => `<tr>${row.map(cell => `<td>${cell || ""}</td>`).join("")}</tr>`).join("")}
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: "application/msword" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `inscritos_${eventTitle.replace(/\s+/g, "_")}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  return (
    <div className="container my-4">
      <h2 className="mb-3">Inscritos del evento</h2>

      {/* BOTÓN PARA DESCARGAR CSV */}
      {registrations.length > 0 && (
        <button className="btn btn-primary mb-3" onClick={downloadWord}>
          Descargar lista de inscritos
        </button>
      )}

      {loading ? (
        <div className="alert alert-secondary">Cargando inscritos...</div>
      ) : registrations.length === 0 ? (
        <div className="alert alert-info">No hay inscritos aún.</div>
      ) : (
        registrations.map((reg) => {
          const badgeClass = reg.status === "pending" ? "bg-warning text-dark" : reg.status === "accepted" ? "bg-success" : "bg-danger";
          return (
            <div key={reg.id} className="card mb-3">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <strong>{reg.User?.nombre}</strong> <small>({reg.User?.email})</small>
                  <div className="mt-1">Estado: <span className={`badge ${badgeClass}`}>{reg.status}</span></div>
                </div>

                <div className="d-flex gap-2">
                  {(!reg.precio || reg.precio === 0) && (
                    <>
                      <button className="btn btn-success" disabled={reg.status !== "pending"} onClick={() => handleValidation(reg.id, "accepted")}>Aceptar</button>
                      <button className="btn btn-danger" disabled={reg.status !== "pending"} onClick={() => handleValidation(reg.id, "rejected")}>Rechazar</button>
                    </>
                  )}

                  {reg.precio > 0 && (
                    <>
                      {reg.paymentProofPath ? (
                        <>
                          <button
                            className="btn btn-secondary"
                            onClick={() => openComprobanteModal(reg.paymentProofPath)}
                          >
                            Ver comprobante
                          </button>

                          <button
                            className="btn btn-success"
                            disabled={reg.status !== "pending"}
                            onClick={() => handleValidation(reg.id, "accepted")}
                          >
                            Aceptar
                          </button>

                          <button
                            className="btn btn-danger"
                            disabled={reg.status !== "pending"}
                            onClick={() => handleValidation(reg.id, "rejected")}
                          >
                            Rechazar
                            </button>
                                </>
                              ) : (
                              <span className="text-muted">Esperando comprobante...</span>
                      )}
                      </>
                  )}

                  <button className="btn btn-outline-danger" onClick={() => handleCancel(reg.id)}>Eliminar</button>
                </div>
              </div>
            </div>
          );
        })
      )}

      {modalOpen && selectedImage && (
        <>
          <div className="modal-backdrop show" onClick={closeComprobanteModal} />
          <div className="modal show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Comprobante de Pago</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={closeComprobanteModal}></button>
                </div>
                <div className="modal-body text-center">
                  <img src={`http://localhost:4000/${selectedImage.replace(/\\/g, "/")}`} alt="Comprobante" className="img-fluid" style={{ maxHeight: "70vh" }} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
