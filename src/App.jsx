import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import OtpVerification from './pages/OtpVerification.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DocumentUpload from './pages/DocumentUpload.jsx';
import AiParsingResults from './pages/AiParsingResults.jsx';
import IdentityVault from './pages/IdentityVault.jsx';
import FormAutofill from './pages/FormAutofill.jsx';
import UrlScanner from './pages/UrlScanner.jsx';
import ProfileSettings from './pages/ProfileSettings.jsx';
import SystemSettings from './pages/SystemSettings.jsx';
import AdminPortal from './pages/AdminPortal.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp-verification" element={<OtpVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected app routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <DocumentUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-parsing-results"
            element={
              <ProtectedRoute>
                <AiParsingResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vault"
            element={
              <ProtectedRoute>
                <IdentityVault />
              </ProtectedRoute>
            }
          />
          <Route
            path="/autofill"
            element={
              <ProtectedRoute>
                <FormAutofill />
              </ProtectedRoute>
            }
          />
          <Route
            path="/url-scanner"
            element={
              <ProtectedRoute>
                <UrlScanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SystemSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPortal />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
