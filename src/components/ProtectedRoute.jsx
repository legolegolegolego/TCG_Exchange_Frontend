import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";

const ProtectedRoute = ({ 
  children,
  requireAdmin = false, 
  matchUsername = false,
  matchUsernameOrAdmin = false,
   }) => {
  const { token, user } = useAuth();
  const params = useParams(); // obtenemos todos los params
  const usernameParam = params.username; // seguro, puede ser undefined
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  // Si no esta logueado, redirige a login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Requiere admin pero no lo es
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/no-disponible" replace />;
  }

  // Validación de username
  if ((matchUsername || matchUsernameOrAdmin) && usernameParam) {
    const usernameMatches = usernameParam === user?.username;

    // matchUsernameOrAdmin: pasa si coincide username o es admin
    if (matchUsernameOrAdmin && !(usernameMatches || isAdmin)) {
      return <Navigate to="/" replace />;
    }

    // matchUsername: pasa solo si coincide username
    if (matchUsername && !usernameMatches) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;