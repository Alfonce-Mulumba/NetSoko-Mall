import axios from "axios";
import API_BASE_URL from "./config.js";

console.log("🌐 API Base URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      // <-- use backticks so token is interpolated
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // don't crash if localStorage access fails
    console.warn("Axios interceptor error:", e);
  }
  return config;
}, (err) => Promise.reject(err));

export default api;