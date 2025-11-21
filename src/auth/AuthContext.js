// src/auth/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Loader from "../shared/Loader";

const API = process.env.REACT_APP_API_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // full profile object
  const [token, setToken] = useState(null);    // JWT string
  const [loading, setLoading] = useState(true);

  // Helper to load profile from API
  const fetchProfile = async (jwt) => {
    try {
      const res = await axios.get(`${API}/auth/profile`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setUser(res.data);        // has fullName, email, address, roles, etc.
    } catch (err) {
      console.error("Failed to load profile:", err);
      // Bad token? log out
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // On first load, read token from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (!stored) {
      setLoading(false);
      return;
    }

    setToken(stored);
    fetchProfile(stored);
  }, []);

  // Login: save token & load profile
  const login = async (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
    setLoading(true);
    await fetchProfile(jwt);
  };

  // Logout: clear everything
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setLoading(false);
    window.location.href = "/login";
  };

  if (loading) return <Loader />;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
