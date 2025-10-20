import api from "./axios";

// ✅ Auth
export const register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
export const getProfile = () => api.get("/auth/profile");

// ✅ Products
export const getProducts = () => api.get("/products");
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post("/products", data);

// ✅ Cart
export const getCart = () => api.get("/cart");
export const addToCart = (data) => api.post("/cart", data);
export const removeFromCart = (id) => api.delete(`/cart/${id}`);

// ✅ Orders
export const getOrders = () => api.get("/orders");
export const createOrder = (data) => api.post("/orders", data);

// ✅ Payments
export const makePayment = (data) => api.post("/payments", data);

// ✅ Admin
export const getAdminDashboard = () => api.get("/admin/dashboard");

// ✅ Complaints
export const getComplaints = () => api.get("/complaints");
export const submitComplaint = (data) => api.post("/complaints", data);

// ✅ Delivery / Address
export const getAddresses = () => api.get("/addresses");
export const addAddress = (data) => api.post("/addresses", data);

export default {
  register,
  login,
  getProfile,
  getProducts,
  getProductById,
  createProduct,
  getCart,
  addToCart,
  removeFromCart,
  getOrders,
  createOrder,
  makePayment,
  getAdminDashboard,
  getComplaints,
  submitComplaint,
  getAddresses,
  addAddress,
};
