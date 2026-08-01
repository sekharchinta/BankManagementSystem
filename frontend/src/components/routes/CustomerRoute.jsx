import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function CustomerRoute() {
  const { isCustomer } = useAuth();
  return isCustomer ? <Outlet /> : <Navigate to="/login" replace />;
}
