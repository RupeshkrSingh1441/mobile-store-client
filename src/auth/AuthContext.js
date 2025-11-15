import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        console.warn('Token expired');
        localStorage.removeItem('token');
        setUser(null);
        return;
      }
      const roles = decoded.roles ? decoded.roles.split(',') : decoded.role
? [decoded.role]
: [];
      setUser({ ...decoded, roles, token });
      //console.log('User loaded from token:', decoded);
    } catch (err) {
      console.error('Invalid token:', err);
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) loadUserFromToken(token);
    console.log("Profile token auth:", token);
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    loadUserFromToken(token);

    try {
      const decoded = jwtDecode(token);
      const roles = decoded.roles
        ? decoded.roles.split(',')
        : decoded.role
        ? [decoded.role]
        : [];

      // ✅ Role-based redirect
      if (roles.includes('Admin')) {
        window.location.href = '/admin-order';
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      console.error('JWT decode failed:', err);
      window.location.href = '/';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
