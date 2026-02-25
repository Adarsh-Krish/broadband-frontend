import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

import PostcodePage from "../pages/merchant/PostcodePage";
import ResultsPage from "../pages/merchant/ResultsPage";
import BusinessFormPage from "../pages/merchant/BusinessFormPage";
import SuccessPage from "../pages/merchant/SuccessPage";

import LoginPage from "../pages/partner/LoginPage";
import DashboardPage from "../pages/partner/DashboardPage";
import SettingsPage from "../pages/partner/SettingsPage";

import AdminDashboard from "../pages/admin/AdminDashboard";
import LeadDetail from "../pages/admin/LeadDetail";
import PartnerManagement from "../pages/admin/PartnerManagement";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Merchant — public */}
        <Route path="/" element={<PostcodePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/apply" element={<BusinessFormPage />} />
        <Route path="/success" element={<SuccessPage />} />

        {/* Auth */}
        <Route path="/partner/login" element={<LoginPage />} />

        {/* Partner — protected */}
        <Route
          path="/partner/dashboard"
          element={
            <ProtectedRoute role="partner">
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/partner/settings"
          element={
            <ProtectedRoute role="partner">
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin — protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leads/:id"
          element={
            <ProtectedRoute role="admin">
              <LeadDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/partners"
          element={
            <ProtectedRoute role="admin">
              <PartnerManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
