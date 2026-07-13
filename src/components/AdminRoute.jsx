import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { jwtDecode } from 'jwt-decode';

/**
 * AdminRoute — wraps protected routes that require admin privileges.
 * Checks both token validity AND user.is_admin before allowing access.
 * Non-admins are redirected to /dashboard.
 */
export default function AdminRoute({ children }) {
  const { isAuthenticated, token, user, logout } = useAuth();

  // 1. Not logged in at all → go to login
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Token expired → logout and redirect
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      logout();
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    logout();
    return <Navigate to="/login" replace />;
  }

  // Debug logging for development
  if (import.meta.env.DEV) {
    console.log('[AdminRoute Debug] isAuthenticated:', isAuthenticated, 'user:', user, 'is_admin:', user?.is_admin);
  }

  // 3. If token is present but user profile is loading or doesn't have roles defined yet, show loading spinner
  if (user === null || user.is_admin === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="font-headline-md text-primary animate-pulse flex items-center gap-3">
          <span className="material-symbols-outlined animate-spin">refresh</span>
          Verifying authorization...
        </div>
      </div>
    );
  }

  // 4. Not an admin → redirect to dashboard (Access Denied)
  if (!user.is_admin) {
    if (import.meta.env.DEV) {
      console.warn('[AdminRoute Warning] Access denied. Redirecting non-admin user to /dashboard.');
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
