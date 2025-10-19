// src/api/axios.js
import axios from "axios";
import config from "./config";

const api = axios.create({
  baseURL: config.BASE_URL,
  withCredentials: true,
});

// ✅ Attach token to every request if available
api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default api;
