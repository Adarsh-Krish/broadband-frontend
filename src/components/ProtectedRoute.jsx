import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/partner/login" replace />;
  if (role && userRole !== role)
    return <Navigate to="/partner/login" replace />;

  return children;
}
