// src/api/index.js
import api from "./axios";

// 🛒 Product endpoints
export const getProducts = () => api.get("/products");

// 🧾 Cart endpoints
export const getCart = () => api.get("/cart");

// 🔑 Auth endpoints
export const login = (data) => api.post("/auth/login", data);

// 🧍 Profile example (optional)
export const getProfile = () => api.get("/auth/profile");

// 📦 Example order API
export const createOrder = (data) => api.post("/orders", data);

export default api;
