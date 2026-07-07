import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { jwtDecode } from 'jwt-decode';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, token, logout } = useAuth();
  
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp < currentTime) {
      // Token is expired
      logout();
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    // Invalid token format
    logout();
    return <Navigate to="/login" replace />;
  }

  return children;
}
