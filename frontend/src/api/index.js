import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let logoutTimer;
const INACTIVITY_LIMIT = 30 * 60 * 1000;
let isLoggingOut = false;

function logoutUser(reason = "You’ve been logged out. Please log in again.") {
  if (isLoggingOut) return;
  isLoggingOut = true;

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  alert(reason);
  window.location.replace("/login");
}

function resetInactivityTimer() {
  clearTimeout(logoutTimer);
  logoutTimer = setTimeout(() => {
    logoutUser("You’ve been logged out due to inactivity. Please log in again.");
  }, INACTIVITY_LIMIT);
}


["click", "mousemove", "keypress", "scroll", "touchstart"].forEach((evt) => {
  window.addEventListener(evt, resetInactivityTimer);
});

resetInactivityTimer();

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (!currentPath.includes("/login") && !currentPath.includes("/register")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Session expired. Please log in again.");
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  }
);


const publicApi = {
  register: (data) => API.post("/auth/register", data),
  verify: (data) => API.post("/auth/verify", data),
  login: (data) => API.post("/auth/login", data),
  forgot: (data) => API.post("/auth/forgot", data),
  reset: (data) => API.post("/auth/reset", data),
  resend: (data) => API.post("/auth/resend-code", data),

  getProducts: (params) => API.get("/products", { params }),
  getHotProducts: (limit = 8) => API.get(`/products/hot?limit=${limit}`),
  getProductById: (id) => API.get(`/products/${id}`),
  searchProducts: (params) => API.get("/products/search", { params }),

  addToCart: (data) => API.post("/cart/add", data),
  getCart: () => API.get("/cart"),
  removeFromCart: (id) => API.delete(`/cart/${id}`),

  placeOrder: (data) => API.post("/orders", data),
  getOrders: () => API.get("/orders"),
  getOrderById: (id) => API.get(`/orders/${id}`),

  getAddresses: () => API.get("/addresses"),
  addAddress: (data) => API.post("/addresses", data),
  deleteAddress: (id) => API.delete(`/addresses/${id}`),
  setDefaultAddress: (id) => API.put(`/addresses/${id}/default`),

  checkOrderStatus: (orderId) => API.get(`/orders/${orderId}`),
  reportProblem: (data) => API.post("/chatbot/report", data),
};

const adminApi = {
  adminGetProducts: () => API.get("/admin/products"),
  adminCreateProduct: (data) => API.post("/admin/products", data),
  adminUpdateStock: (id, body) => API.put(`/admin/products/${id}/stock`, body),
  adminUpdateDiscount: (id, body) => API.put(`/admin/products/${id}/discount`, body),
  adminUpdateProduct: (id, data) => API.put(`/admin/products/${id}`, data),
  adminDeleteProduct: (id) => API.delete(`/admin/products/${id}`),

  adminGetUsers: () => API.get("/admin/users"),
  adminDeleteUser: (id) => API.delete(`/admin/users/${id}`),
  adminUpdateUser: (id, data) => API.put(`/admin/users/${id}`, data),

  adminGetOrders: () => API.get("/admin/orders"),
  adminUpdateOrder: (id, body) => API.put(`/admin/orders/${id}`, body),

  adminGetAnalytics: () => API.get("/admin/analytics"),
  adminGetComplaints: () => API.get("/admin/complaints"),
  adminMarkComplaintRead: (id) => API.put(`/admin/complaints/${id}/read`),
  adminUnreadComplaintsCount: () => API.get("/admin/complaints/unread/count"),
};

export default {
  ...publicApi,
  ...adminApi,
};
