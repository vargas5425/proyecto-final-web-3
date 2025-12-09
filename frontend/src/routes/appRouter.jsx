import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Páginas públicas
import Home from "../pages/public/home.jsx";
import EventDetail from "../pages/public/eventDetail.jsx";

// Auth
import Login from "../pages/auth/login.jsx";
import Register from "../pages/auth/register.jsx";

// Participante
import DashboardParticipant from "../pages/participant/dashboard.jsx";
import MyRegistrations from "../pages/participant/myRegistrations.jsx";
import CancelRegistration from "../pages/participant/cancelRegistration.jsx";

// Organizador
import DashboardOrganizer from "../pages/organizer/dashboard.jsx";
import Reports from "../pages/organizer/reports.jsx";
import ManageRegistrations from "../pages/organizer/manageRegistrations.jsx";
import CrearEvento from "../pages/organizer/crearEvento.jsx";

// Admin
import UserManagement from "../pages/admin/userManagement.jsx";

// Validador
import QRValidation from "../pages/validator/QRValidation.jsx";

// Contexto de autenticación
import { useAuth } from "../hooks/useAuth.js";

// Componente PrivateRoute
function PrivateRoute({ children, rolesPermitidos }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!rolesPermitidos.includes(user.rol)) return <Navigate to="/login" replace />;

  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* PÚBLICAS */}
      <Route path="/" element={<Home />} />
      <Route path="/event/:id" element={<EventDetail />} />

      {/* AUTH */}
      <Route
        path="/login"
        element={<LoginRedirect />}
      />
      <Route
        path="/register"
        element={<RegisterRedirect />}
      />

      {/* PARTICIPANTE */}
      <Route
        path="/participant"
        element={
          <PrivateRoute rolesPermitidos={["participant"]}>
            <DashboardParticipant />
          </PrivateRoute>
        }
      />
      <Route
        path="/participant/registrations"
        element={
          <PrivateRoute rolesPermitidos={["participant"]}>
            <MyRegistrations />
          </PrivateRoute>
        }
      />
      <Route
        path="/participant/cancel"
        element={
          <PrivateRoute rolesPermitidos={["participant"]}>
            <CancelRegistration />
          </PrivateRoute>
        }
      />
      <Route
        path="/participant/event/:id"
        element={
          <PrivateRoute rolesPermitidos={["participant"]}>
            <EventDetail />
          </PrivateRoute>
        }
      />

      {/* ORGANIZADOR */}
      <Route
        path="/organizer"
        element={
          <PrivateRoute rolesPermitidos={["organizer"]}>
            <DashboardOrganizer />
          </PrivateRoute>
        }
      />
      <Route
        path="/organizer/crear-evento"
        element={
          <PrivateRoute rolesPermitidos={["organizer"]}>
            <CrearEvento />
          </PrivateRoute>
        }
      />
      <Route
        path="/organizer/crear-evento/:id"
        element={
          <PrivateRoute rolesPermitidos={["organizer"]}>
            <CrearEvento />
          </PrivateRoute>
        }
      />
      <Route
        path="/organizer/reports"
        element={
          <PrivateRoute rolesPermitidos={["organizer"]}>
            <Reports />
          </PrivateRoute>
        }
      />
      <Route
        path="/organizer/manage-registrations/:eventId"
        element={
          <PrivateRoute rolesPermitidos={["organizer"]}>
            <ManageRegistrations />
          </PrivateRoute>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <PrivateRoute rolesPermitidos={["admin"]}>
            <UserManagement />
          </PrivateRoute>
        }
      />

      {/* VALIDADOR */}
      <Route
        path="/validator"
        element={
          <PrivateRoute rolesPermitidos={["validator"]}>
            <QRValidation />
          </PrivateRoute>
        }
      />

      {/* CATCH-ALL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Redirecciones para login y register según si hay usuario
function LoginRedirect() {
  const { user } = useAuth();
  if (user) {
    switch (user.rol) {
      case "admin":
        return <Navigate to="/admin" replace />;
      case "organizer":
        return <Navigate to="/organizer" replace />;
      case "validator":
        return <Navigate to="/validator" replace />;
      default:
        return <Navigate to="/participant" replace />;
    }
  }
  return <Login />;
}

function RegisterRedirect() {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : <Register />;
}
