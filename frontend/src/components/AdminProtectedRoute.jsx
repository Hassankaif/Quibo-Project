import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;
  if (user?.role !== "Admin") return <Navigate to="/" replace />;

  return children;
};

export default AdminProtectedRoute;
