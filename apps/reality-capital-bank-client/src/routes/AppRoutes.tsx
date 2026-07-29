import { Routes, Route, Navigate } from "react-router-dom";

import CustomerLayout from "@/layouts/CustomerLayout";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardPage from "../features/dashboard/pages/DashboardPage";

import ProtectedRoute from "./ProtectedRoute";

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/verify-email" element={<VerifyEmailPage />} />

        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route
          element={
            <ProtectedRoute>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        {/* Accounts */}

        {/* Transfers */}
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
