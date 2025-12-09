import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-info fixed-top">
      <div className="container-fluid">
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navMenu" 
          aria-controls="navMenu" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 fw-bold">

            {/* MOSTRAR Inicio solo si NO hay usuario logueado */}
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">Inicio</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Registro</Link>
                </li>
              </>
            )}

            {/* navbar participante*/}

            {user?.rol === "participant" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/participant">Eventos</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/participant/registrations">Mis Inscripciones</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/participant/cancel">Cancelar Inscripción</Link>
                </li>
              </>
            )}

            {/* navbar organizer*/}

            {user?.rol === "organizer" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/organizer">Gestión de Eventos</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/organizer/reports">Reportes</Link>
                </li>
              </>
            )}

            {/* navbar admin*/}

            {user?.rol === "admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Usuarios</Link>
              </li>
            )}

            {/* navbar validator*/}

            {user?.rol === "validator" && (
              <li className="nav-item">
                <Link className="nav-link" to="/validator">Validar QR</Link>
              </li>
            )}
          </ul>

          {user && (
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center me-3">
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2" 
                     style={{ width: "32px", height: "32px" }}>
                  <i className="fa-solid fa-user"></i>
                </div>
                <span className="text-dark fw-semibold">
                  {user.nombre || user.email}
                </span>
              </div>
              
              <button 
                className="btn btn-danger btn-sm fw-bold d-flex align-items-center" 
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt me-1"></i>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
