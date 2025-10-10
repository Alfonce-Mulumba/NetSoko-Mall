// frontend/src/api/index.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// ===========================
// 🔐 Attach JWT automatically
// ===========================
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===========================
// 🚨 Auto-logout after 30 min inactivity
// ===========================
let logoutTimer;
const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes

function resetInactivityTimer() {
  clearTimeout(logoutTimer);
  logoutTimer = setTimeout(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // if you store user data
    alert("You’ve been logged out due to inactivity. Please log in again.");
    window.location.href = "/login";
  }, INACTIVITY_LIMIT);
}

// Listen for user activity
["click", "mousemove", "keypress", "scroll", "touchstart"].forEach((evt) => {
  window.addEventListener(evt, resetInactivityTimer);
});

// Start timer on load
resetInactivityTimer();

// ===========================
// 🧭 Handle expired/invalid tokens globally
// ===========================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token invalid or expired
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ===========================
// 🌐 API ROUTES
// ===========================
const publicApi = {
  // Auth
  register: (data) => API.post("/auth/register", data),
  verify: (data) => API.post("/auth/verify", data),
  login: (data) => API.post("/auth/login", data),
  forgot: (data) => API.post("/auth/forgot", data),
  reset: (data) => API.post("/auth/reset", data),
  resend: (data) => API.post("/auth/resend-code", data),

  // Products
  getProducts: (params) => API.get("/products", { params }),
  getHotProducts: (limit = 8) => API.get(`/products/hot?limit=${limit}`),
  getProductById: (id) => API.get(`/products/${id}`),
  searchProducts: (params) => API.get("/products/search", { params }),

  // Cart
  addToCart: (data) => API.post("/cart/add", data),
  getCart: () => API.get("/cart"),
  removeFromCart: (id) => API.delete(`/cart/${id}`),

  // Orders
  placeOrder: (data) => API.post("/orders", data),
  getOrders: () => API.get("/orders"),
  getOrderById: (id) => API.get(`/orders/${id}`),

  // Addresses
  getAddresses: () => API.get("/addresses"),
  addAddress: (data) => API.post("/addresses", data),
  deleteAddress: (id) => API.delete(`/addresses/${id}`),
  setDefaultAddress: (id) => API.put(`/addresses/${id}/default`),

  // Chatbot & Reports
  checkOrderStatus: (orderId) => API.get(`/orders/${orderId}`),
  reportProblem: (data) => API.post("/chatbot/report", data),
};

const adminApi = {
  // Product Management
  adminGetProducts: () => API.get("/admin/products"),
  adminCreateProduct: (data) => API.post("/admin/products", data),
  adminUpdateStock: (id, body) => API.put(`/admin/products/${id}/stock`, body),
  adminUpdateDiscount: (id, body) => API.put(`/admin/products/${id}/discount`, body),
  adminUpdateProduct: (id, data) => API.put(`/admin/products/${id}`, data),
  adminDeleteProduct: (id) => API.delete(`/admin/products/${id}`),

  // User Management
  adminGetUsers: () => API.get("/admin/users"),
  adminDeleteUser: (id) => API.delete(`/admin/users/${id}`),

  // Orders
  adminGetOrders: () => API.get("/admin/orders"),
  adminUpdateOrder: (id, body) => API.put(`/admin/orders/${id}`, body),

  // Analytics & Complaints
  adminGetAnalytics: () => API.get("/admin/analytics"),
  adminGetComplaints: () => API.get("/admin/complaints"),
  adminMarkComplaintRead: (id) => API.put(`/admin/complaints/${id}/read`),
  adminUnreadComplaintsCount: () => API.get("/admin/complaints/unread/count"),
};

// Export combined API
export default {
  ...publicApi,
  ...adminApi,
};
