import React, { createContext, useContext, useState } from 'react';
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

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('neovault_token');
    localStorage.removeItem('neovault_user');
  }

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
