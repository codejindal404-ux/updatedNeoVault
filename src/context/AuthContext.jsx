import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('neovault_token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('neovault_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user: userData } = response.data;
      setUser(userData);
      setToken(access_token);
      localStorage.setItem('neovault_token', access_token);
      localStorage.setItem('neovault_user', JSON.stringify(userData));
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (fullName, email, phone, password) => {
    try {
      // Backend expects email and password. Sending others if we want to expand backend later.
      const response = await api.post('/auth/register', { email, password, fullName, phone });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  const verifyOtp = async (email, code) => {
    try {
      const response = await api.post('/auth/verify-otp', { email, code });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('neovault_token');
    localStorage.removeItem('neovault_user');
  }, []);

  // Fetch latest user details (/auth/me) on mount or token change to keep user state and is_admin updated
  useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then(response => {
          const userData = response.data;
          setUser(userData);
          localStorage.setItem('neovault_user', JSON.stringify(userData));
        })
        .catch(err => {
          // If the token is invalid, the 401 interceptor will trigger neovault-auth-logout
        });
    }
  }, [token]);

  // Listen for forced-logout events dispatched by the api.js 401 interceptor.
  // This keeps React state and localStorage in sync without a hard page reload.
  useEffect(() => {
    const handleForcedLogout = () => {
      logout();
    };
    window.addEventListener('neovault-auth-logout', handleForcedLogout);
    return () => window.removeEventListener('neovault-auth-logout', handleForcedLogout);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, register, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
