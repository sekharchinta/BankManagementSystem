import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "../components/layout/Layout";
import CustomerLayout from "../components/layout/CustomerLayout";
import PrivateRoute from "../components/common/PrivateRoute";
import CustomerPrivateRoute from "../components/common/CustomerPrivateRoute";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import Accounts from "../pages/Accounts";
import Deposit from "../pages/Deposit";
import Withdraw from "../pages/Withdraw";
import Transfer from "../pages/Transfer";
import Transactions from "../pages/Transactions";
import NotFound from "../pages/NotFound";

// Customer Pages
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import CustomerTransfer from "../pages/customer/CustomerTransfer";
import CustomerDeposit from "../pages/customer/CustomerDeposit";
import CustomerTransactions from "../pages/customer/CustomerTransactions";
import CustomerProfile from "../pages/customer/CustomerProfile";

function StaffProtectedLayout({ children }) {
  return (
    <PrivateRoute>
      <Layout>{children}</Layout>
    </PrivateRoute>
  );
}

function CustomerProtectedLayout({ children }) {
  return (
    <CustomerPrivateRoute>
      <CustomerLayout>{children}</CustomerLayout>
    </CustomerPrivateRoute>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Staff Portal Protected Routes */}
      <Route
        path="/dashboard"
        element={<StaffProtectedLayout><Dashboard /></StaffProtectedLayout>}
      />
      <Route
        path="/customers"
        element={<StaffProtectedLayout><Customers /></StaffProtectedLayout>}
      />
      <Route
        path="/accounts"
        element={<StaffProtectedLayout><Accounts /></StaffProtectedLayout>}
      />
      <Route
        path="/deposit"
        element={<StaffProtectedLayout><Deposit /></StaffProtectedLayout>}
      />
      <Route
        path="/withdraw"
        element={<StaffProtectedLayout><Withdraw /></StaffProtectedLayout>}
      />
      <Route
        path="/transfer"
        element={<StaffProtectedLayout><Transfer /></StaffProtectedLayout>}
      />
      <Route
        path="/transactions"
        element={<StaffProtectedLayout><Transactions /></StaffProtectedLayout>}
      />

      {/* Customer Portal Protected Routes */}
      <Route
        path="/customer/dashboard"
        element={<CustomerProtectedLayout><CustomerDashboard /></CustomerProtectedLayout>}
      />
      <Route
        path="/customer/transfer"
        element={<CustomerProtectedLayout><CustomerTransfer /></CustomerProtectedLayout>}
      />
      <Route
        path="/customer/deposit"
        element={<CustomerProtectedLayout><CustomerDeposit /></CustomerProtectedLayout>}
      />
      <Route
        path="/customer/transactions"
        element={<CustomerProtectedLayout><CustomerTransactions /></CustomerProtectedLayout>}
      />
      <Route
        path="/customer/profile"
        element={<CustomerProtectedLayout><CustomerProfile /></CustomerProtectedLayout>}
      />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}