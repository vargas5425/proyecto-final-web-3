import React from "react";

export default function AlertModal({ show, title, message, onClose }) {
  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop show" onClick={onClose} />
      <div className="modal show d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title || "Aviso"}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <p>{message}</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={onClose}>Aceptar</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
