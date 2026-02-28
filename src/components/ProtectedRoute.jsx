import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { token, user } = useAuth();

  // Si no esta logueado, redirige a login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Requiere admin pero no lo es
  if (requireAdmin && !user?.roles?.includes("ROLE_ADMIN")) {
    return <Navigate to="/no-disponible" replace />;
  }

  return children;
};

export default ProtectedRoute;