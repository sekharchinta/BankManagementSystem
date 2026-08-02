import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import StaffRoute from "../components/routes/StaffRoute";
import CustomerRoute from "../components/routes/CustomerRoute";
import StaffLayout from "../components/Layout/StaffLayout";
import CustomerLayout from "../components/Layout/CustomerLayout";
import Spinner from "../components/ui/Spinner";

const Login = lazy(() => import("../pages/Login"));
const NotFound = lazy(() => import("../pages/NotFound"));

const Dashboard = lazy(() => import("../pages/staff/Dashboard"));
const Customers = lazy(() => import("../pages/staff/Customers"));
const Accounts = lazy(() => import("../pages/staff/Accounts"));
const Users = lazy(() => import("../pages/staff/Users"));
const Transactions = lazy(() => import("../pages/staff/Transactions"));
const Deposit = lazy(() => import("../pages/staff/Deposit"));
const Withdraw = lazy(() => import("../pages/staff/Withdraw"));
const Transfer = lazy(() => import("../pages/staff/Transfer"));
const Reports = lazy(() => import("../pages/staff/Reports"));
const Profile = lazy(() => import("../pages/staff/Profile"));

const CustomerDashboard = lazy(() => import("../pages/customer/CustomerDashboard"));
const CustomerDeposit = lazy(() => import("../pages/customer/CustomerDeposit"));
const CustomerTransfer = lazy(() => import("../pages/customer/CustomerTransfer"));
const CustomerTransactions = lazy(() => import("../pages/customer/CustomerTransactions"));
const CustomerProfile = lazy(() => import("../pages/customer/CustomerProfile"));

function PageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner size={28} />
    </div>
  );
}

function HomeRedirect() {
  const { isStaff, isCustomer } = useAuth();
  if (isStaff) return <Navigate to="/dashboard" replace />;
  if (isCustomer) return <Navigate to="/customer" replace />;
  return <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />

        {/* Staff portal */}
        <Route element={<StaffRoute />}>
          <Route element={<StaffLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/users" element={<Users />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Customer portal */}
        <Route element={<CustomerRoute />}>
          <Route element={<CustomerLayout />}>
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/customer/deposit" element={<CustomerDeposit />} />
            <Route path="/customer/transfer" element={<CustomerTransfer />} />
            <Route path="/customer/transactions" element={<CustomerTransactions />} />
            <Route path="/customer/profile" element={<CustomerProfile />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
