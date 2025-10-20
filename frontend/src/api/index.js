// src/api/index.js
import axiosInstance from "./axios";

// ✅ AUTH
const login = (data) => axiosInstance.post("/auth/login", data);
const register = (data) => axiosInstance.post("/auth/register", data);

// ✅ PRODUCTS
const getProducts = (params = {}) => axiosInstance.get("/products", { params });
const searchProducts = (params = {}) =>
  axiosInstance.get("/products/search", { params });
const getProductById = (id) => axiosInstance.get(`/products/${id}`);

// ✅ CART
const getCart = () => axiosInstance.get("/cart");
const addToCart = (data) => axiosInstance.post("/cart", data);
const removeFromCart = (id) => axiosInstance.delete(`/cart/${id}`);

// ✅ ORDERS
const createOrder = (data) => axiosInstance.post("/orders", data);
const getOrders = () => axiosInstance.get("/orders");

// ✅ EXPORT all
const api = {
  login,
  register,
  getProducts,
  searchProducts,
  getProductById,
  getCart,
  addToCart,
  removeFromCart,
  createOrder,
  getOrders,
};

export default api;
