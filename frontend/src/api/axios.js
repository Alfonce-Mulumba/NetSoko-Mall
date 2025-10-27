import axios from "axios";
import API_BASE_URL from "./config.js";

console.log("🌐 API Base URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ✅ Custom events to trigger global loading
const showLoading = () => window.dispatchEvent(new CustomEvent("loading:start"));
const hideLoading = () => window.dispatchEvent(new CustomEvent("loading:end"));

api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn("Axios interceptor error:", e);
    }

    // Trigger global spinner
    showLoading();

    return config;
  },
  (err) => {
    hideLoading();
    return Promise.reject(err);
  }
);

api.interceptors.response.use(
  (res) => {
    hideLoading();
    return res;
  },
  (err) => {
    hideLoading();
    return Promise.reject(err);
  }
);

export default api;
