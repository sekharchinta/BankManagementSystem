import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const refreshToken = localStorage.getItem("refresh");
      if (refreshToken) {
        originalRequest._retry = true;
        try {
          refreshPromise =
            refreshPromise ||
            axios.post(`${API_BASE_URL}token/refresh/`, { refresh: refreshToken });
          const { data } = await refreshPromise;
          refreshPromise = null;

          const { access, refresh } = data;
          localStorage.setItem("access", access);
          if (refresh) {
            localStorage.setItem("refresh", refresh);
          }

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          refreshPromise = null;
          clearSession();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export const SESSION_KEYS = [
  "access",
  "refresh",
  "user_role",
  "customer_info",
  "customer_accounts",
  "customer_active_account",
  "staff_profile",
];

export function clearSession() {
  SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
}

export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;
  if (!data) {
    return error?.message || fallback;
  }
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  if (data.error) return data.error;
  if (data.message) return data.message;

  const firstKey = Object.keys(data)[0];
  if (firstKey) {
    const value = data[firstKey];
    if (Array.isArray(value)) return `${firstKey}: ${value[0]}`;
    return `${firstKey}: ${value}`;
  }
  return fallback;
}

export default api;
