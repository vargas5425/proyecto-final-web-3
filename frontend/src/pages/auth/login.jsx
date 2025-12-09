import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { login } from "../../services/authService.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { setUser } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const userData = await login({ email, password });

    // Guardar token en localStorage
    localStorage.setItem("token", userData.token);

    // Guardar datos del usuario en el contexto
    setUser(userData.usuario);

    // Redirigir según rol
    if (userData.usuario.rol === "participant") navigate("/participant");
    else if (userData.usuario.rol === "organizer") navigate("/organizer");
    else if (userData.usuario.rol === "admin") navigate("/admin");
    else if (userData.usuario.rol === "validator") navigate("/validator");
  } catch (err) {
    setError(err.response?.data?.message || "Credenciales inválidas");
  }
};

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5">
          <div className="card w-100">
            <div className="card-body">
          <h3 className="card-title mb-3">Iniciar Sesión</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                className="form-control"
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                className="form-control"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Ingresar</button>
          </form>
          {error && <div className="mt-3 text-danger">{error}</div>}
        </div>
      </div>
    </div>
  </div>
</div>
  );
}
