import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;}
  return config;
});

export default {
  register: (data) => api.post("/auth/register", data),
  verify: (data) => api.post("/auth/verify", data),
  login: (data) => api.post("/auth/login", data),
  forgot: (data) => api.post("/auth/forgot", data),
  reset: (data) => api.post("/auth/reset", data),
  resend: (data) => api.post("/auth/resend-code", data),

  getProducts: (params) => api.get("/products", { params }),
  getHotProducts: (limit = 8) => api.get(`/products/hot?limit=${limit}`),
  getProductById: (id) => api.get(`/products/${id}`),
  searchProducts: (params) => api.get("/products/search", { params }),

  addToCart: (data) => api.post("/cart/add", data),
  getCart: () => api.get("/cart"),
  removeFromCart: (id) => api.delete(`/cart/${id}`),

  placeOrder: (data) => api.post("/orders", data),
  getOrders: () => api.get("/orders"),
  getOrderById: (id) => api.get(`/orders/${id}`),

  addAddress: (data) => api.post("/addresses", data),
  getAddresses: () => api.get("/addresses"),

  checkOrderStatus: (orderId) => api.get(`/orders/${orderId}`),
  reportProblem: (data) => api.post("/chatbot/report", data),

  adminGetProducts: () => api.get("/admin/products"),
  adminCreateProduct: (data) => api.post("/admin/products", data),
  adminUpdateStock: (id, body) => api.put(`/admin/products/${id}/stock`, body),
  adminUpdateDiscount: (id, body) => api.put(`/admin/products/${id}/discount`, body),
  adminDeleteProduct: (id) => api.delete(`/admin/products/${id}`),
  adminUpdateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  adminGetUsers: () => api.get("/admin/users"),
  adminDeleteUser: (id) => api.delete(`/admin/users/${id}`),
  adminGetOrders: () => api.get("/admin/orders"),
  adminUpdateOrder: (id, body) => api.put(`/admin/orders/${id}`, body),
  adminGetAnalytics: () => api.get("/admin/analytics"),
  adminGetComplaints: () => api.get("/admin/complaints"),
  adminMarkComplaintRead: (id) => api.put(`/admin/complaints/${id}/read`),
  adminUnreadComplaintsCount: () => api.get("/admin/complaints/unread/count"),
};
