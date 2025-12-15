import React, { useState } from "react";
import { validateQR } from "../../services/validationService.js";

export default function QRValidation() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);

  const handleValidate = async () => {
    try {
      let token = code.trim();

      // Si el usuario pega la URL completa, extraemos solo el token
      if (token.includes("token=")) {
        const url = new URL(token);
        token = url.searchParams.get("token");
      }

      if (!token) {
        setResult({ status: "inválido" });
        setCode(""); // limpiar campo si no hay token
        return;
      }

      const res = await validateQR(token);
      setResult(res);
      setCode(""); // limpiar campo después de validar
      
    } catch {
      setResult({ status: "inválido" });
      setCode(""); // limpiar campo también en caso de error
    }
  };

  return (
    <div className="position-absolute top-0 start-0 w-100 min-vh-100 bg-dark text-white">
      <div className="container my-4 pt-4 mt-5">
        <h2 className="mb-3">Validación de Código QR</h2>
  
        <form onSubmit={(e) => { e.preventDefault(); handleValidate(); }}>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control bg-light text-dark"
              placeholder="Ingrese el código QR o pegue la URL"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">
              Validar
            </button>
          </div>
        </form>

        {result && (
          <div
            className={`alert ${
              result.status === "válido" ? "alert-success" : "alert-danger"
            } pt-3 mt-4`}
          >
            <p>
              <strong>Participante:</strong> {result.participante || "N/A"}
            </p>
            <p>
              <strong>Estado:</strong> {result.status}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
