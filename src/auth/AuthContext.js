// src/auth/AuthContext.js
import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import Loader from "../shared/Loader";
import { axiosSecure, setupAxiosInterceptors } from "../api/axiosInstance";

const API = process.env.REACT_APP_API_URL;

export const AuthContext = createContext();

const parseJwt = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("accessToken") || null
  );
  const [refreshToken, setRefreshToken] = useState(
    () => localStorage.getItem("refreshToken") || null
  );

  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef(null);

  const clearRefreshTimer = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  };

  // schedule silent refresh a bit before token expiry
  const scheduleSilentRefresh = (jwt) => {
    clearRefreshTimer();
    if (!jwt) return;
    const payload = parseJwt(jwt);
    if (!payload?.exp) return;

    const expMs = payload.exp * 1000;
    const now = Date.now();
    const refreshAt = expMs - 30 * 1000; // 30s before expiry
    const delay = Math.max(refreshAt - now, 0);

    if (delay <= 0) {
      // token already near/expired -> refresh now
      tryRefreshToken();
      return;
    }

    refreshTimerRef.current = setTimeout(() => {
      tryRefreshToken();
    }, delay);
  };

  // try to refresh tokens using refresh token stored (local state or localStorage)
  const tryRefreshToken = async () => {
    const rt = refreshToken || localStorage.getItem("refreshToken");
    if (!rt) {
      // nothing to refresh with -> logout
      await logout();
      return;
    }

    try {
      const res = await axios.post(`${API}/auth/refresh-token`, {
        refreshToken: rt,
      });
      const { accessToken: newAccess, refreshToken: newRefresh } = res.data;

      // persist
      localStorage.setItem("accessToken", newAccess);
      localStorage.setItem("refreshToken", newRefresh);

      // update local state
      setAccessToken(newAccess);
      setRefreshToken(newRefresh);

      // re-wire interceptors so axiosSecure uses the new token getter
      setupAxiosInterceptors(
        tryRefreshToken,
        () => localStorage.getItem("accessToken"),
        () => logout(false)
      );

      // schedule next silent refresh
      scheduleSilentRefresh(newAccess);

      // fetch profile with new access token
      await fetchProfile(newAccess);
    } catch (err) {
      // refresh failed -> log out
      await logout();
    }
  };

  // fetch profile using axiosSecure (which should have interceptors to add auth header)
  const fetchProfile = async (tokenToUse) => {
    try {
      // If axiosSecure attaches Authorization header already, no need to pass headers
      // but we still set it just in case
      const res = await axiosSecure.get(`${API}/auth/profile`, {
        headers: { Authorization: `Bearer ${tokenToUse || accessToken}` },
      });
      setUser(res.data);
      setLoading(false);
    } catch (err) {
      // if 401 or failure, try to refresh once (if not already tried inside axios interceptor)
      // but avoid infinite loops: tryRefreshToken will call logout if it cannot refresh
      await tryRefreshToken();
      // if tryRefreshToken ends up logging out, loading will be false there; ensure we don't hang
      setLoading(false);
    }
  };

  // run once on app start
  useEffect(() => {
    // Always initialize axios interceptors once on startup
    setupAxiosInterceptors(
      tryRefreshToken,
      () => localStorage.getItem("accessToken"),
      () => logout(false)
    );

    // If tokens exist in localStorage, set them and try fetch profile
    const storedAccess = localStorage.getItem("accessToken");
    const storedRefresh = localStorage.getItem("refreshToken");

    if (storedAccess && storedRefresh) {
      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);
      scheduleSilentRefresh(storedAccess);
      // fetch profile; if it fails, tryRefreshToken will run and logout if impossible
      fetchProfile(storedAccess).catch(() => {
        // ensure loader not stuck
        setLoading(false);
      });
    } else {
      setLoading(false);
    }

    // cleanup on unmount
    return () => clearRefreshTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // login: called after backend returns tokens
  // Accepts raw tokens and wires everything
  const login = async (jwtAccess, jwtRefresh) => {
    if (!jwtAccess || !jwtRefresh) {
      throw new Error("Missing tokens in login()");
    }

    // persist tokens
    localStorage.setItem("accessToken", jwtAccess);
    localStorage.setItem("refreshToken", jwtRefresh);

    setAccessToken(jwtAccess);
    setRefreshToken(jwtRefresh);

    // re-wire axios interceptors with fresh getters
    setupAxiosInterceptors(
      tryRefreshToken,
      () => localStorage.getItem("accessToken"),
      () => logout(false)
    );

    // schedule refresh and fetch profile
    scheduleSilentRefresh(jwtAccess);
    setLoading(true);
    try {
      await fetchProfile(jwtAccess);
    } finally {
      setLoading(false);
    }
  };

  // logout: call backend to invalidate refresh token (best effort), then clear client state
  // 'redirect' controls whether to navigate to /login (used by internal flows to avoid double redirect)
  const logout = async (redirect = true) => {
    try {
      const rt = refreshToken || localStorage.getItem("refreshToken");
      if (rt) {
        // use axios (not axiosSecure) to avoid interceptor loops
        await axios.post(`${API}/auth/logout`, { refreshToken: rt });
      }
    } catch (err) {
      // ignore network failure on logout
      console.warn("Logout request failed (ignored).", err);
    }

    clearRefreshTimer();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setLoading(false);

    if (redirect) {
      // redirect using location to ensure fresh app state
      window.location.href = "/login";
    }
  };

  if (loading) return <Loader />;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        login,
        logout,
        loading,
        tryRefreshToken, // exposed if other parts need to trigger manual refresh
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
