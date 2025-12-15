import React, { useState, useEffect } from "react";
import { AuthContext } from "./authContext.js";
import { getCurrentUser } from "../services/authService.js";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const token = localStorage.getItem("token");
        if (!token) {
              setTimeout(() => setLoading(false), 0);
          return;
        }

      getCurrentUser()
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {loading ? <div>Cargando...</div> : children}
    </AuthContext.Provider>
  );
};
