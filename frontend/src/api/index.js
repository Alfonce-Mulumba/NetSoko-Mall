import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://netsoko-mall.onrender.com";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getProducts = () => api.get("/products");
export const getCart = () => api.get("/cart");
export const login = (data) => api.post("/auth/login", data);

export default api;
