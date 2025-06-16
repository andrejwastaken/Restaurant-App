import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; 

function ProtectedRoute({ children }) {
  const { isAuthorized } = useAuth();

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;