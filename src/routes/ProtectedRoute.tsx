import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth(); // ✅ Agora `token` é reconhecido corretamente

  return token ? <>{children}</> : <Navigate to="/" />;
};

export default ProtectedRoute;
