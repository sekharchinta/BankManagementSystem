import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function StaffRoute() {
  const { isStaff } = useAuth();
  return isStaff ? <Outlet /> : <Navigate to="/login" replace />;
}
