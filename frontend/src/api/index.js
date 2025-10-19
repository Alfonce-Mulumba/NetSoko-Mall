import axios from "axios";

const BASE_URL = "https://netsoko-mall.onrender.com/api";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // for cookies if needed
});

// Attach JWT token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      alert("Session expired. Please log in again.");
      window.location.replace("/login");
    }
    return Promise.reject(err);
  }
);

// Public API
export const publicApi = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
  getProducts: (params) => API.get("/products", { params }),
  getHotProducts: (limit = 8) => API.get(`/products/hot?limit=${limit}`),
  getProductById: (id) => API.get(`/products/${id}`),
  searchProducts: (params) => API.get("/products/search", { params }),
  getCart: () => API.get("/cart"),
  addToCart: (data) => API.post("/cart/add", data),
  removeFromCart: (id) => API.delete(`/cart/${id}`),
};

// Admin API (if needed)
export const adminApi = {
  // add admin calls here
};

export default API;
