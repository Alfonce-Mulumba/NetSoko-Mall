import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || process.env.REACT_APP_API_BASE || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

// attach token if available
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("webwave_user");
    if (raw) {
      const user = JSON.parse(raw);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
  } catch (e) { /* ignore */ }
  return config;
}, (err) => Promise.reject(err));

// simple response interceptor for convenience
api.interceptors.response.use((res) => res, (err) => {
  // you can add global error handling here
  return Promise.reject(err);
});

export default api;
