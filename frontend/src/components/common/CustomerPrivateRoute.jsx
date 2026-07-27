import { Navigate } from "react-router-dom";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

export default function CustomerPrivateRoute({ children }) {
  const { isAuthenticated } = useCustomerAuth();
  const token = localStorage.getItem("access");

  if (!token && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
