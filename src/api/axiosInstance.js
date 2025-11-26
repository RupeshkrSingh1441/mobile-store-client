import axios from "axios";
import { toast } from "react-toastify";

const API = process.env.REACT_APP_API_URL;

// Base axios instance
export const axiosSecure = axios.create({
  baseURL: API,
  withCredentials: false,
});

// Injected functions
let refreshTokenFn = null;
let getAccessTokenFn = null;
let logoutFn = null;

// Configure interceptors once
export const setupAxiosInterceptors = (
  tryRefreshToken,
  getAccessToken,
  logout
) => {
  refreshTokenFn = tryRefreshToken;
  getAccessTokenFn = getAccessToken;
  logoutFn = logout;

  // ==========================
  // REQUEST INTERCEPTOR
  // ==========================
  axiosSecure.interceptors.request.use(
    (config) => {
      const token = getAccessTokenFn();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  // ==========================
  // RESPONSE INTERCEPTOR
  // ==========================
  axiosSecure.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error.config;

      // Not a 401? → pass through
      if (error.response?.status !== 401 || original._retry) {
        return Promise.reject(error);
      }

      original._retry = true;

      try {
        // Try refreshing token
        await refreshTokenFn();

        // Retry original request with new access token
        const newToken = getAccessTokenFn();
        original.headers.Authorization = `Bearer ${newToken}`;
        return axiosSecure(original);
      } catch (err) {
        toast.error("Your session expired. Please login again.", {
          duration: 20000, // Set the duration to 20000ms (20 seconds)
        });
        logoutFn();
        return Promise.reject(err);
      }
    }
  );
};
