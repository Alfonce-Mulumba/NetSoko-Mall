import api from "./axios.js";

export const register = (data) => api.post("/auth/register", data);
export const verify = (data) => api.post("/auth/verify", data);
export const resend = (email) => api.post("/auth/resend-otp", { email });
export const forgot = (data) => api.post("/auth/forgot", data);
export const login = (data) => api.post("/auth/login", data);
export const getProfile = () => api.get("/auth/profile");
export const reset = (data) => api.post("/auth/reset", data);

export const getProducts = (params = {}) =>
  api.get("/products", { params }); // allows passing { limit, sort }

export const getProductById = (id) => api.get(`/products/${id}`);
export const searchProducts = (params = {}) =>
  api.get("/products/search", { params });

export const getProductsByCategory = (category) =>
  api.get(`/products/category/${category}`);

export const getCart = () => api.get("/cart");
export const addToCart = (data) => api.post("/cart/add", data);
export const removeFromCart = (id) => api.delete(`/cart/${id}`);
export const updateCartItem = async (id, data) => { const res = await api.put(`/cart/${id}`, data); return res; };

export const getOrders = () => api.get("/orders");
export const createOrder = (data) => api.post("/orders", data);

export const makePayment = (data) => api.post("/payments", data);

// Admin
export const getAdminDashboard = () => api.get("/admin/dashboard");
export const  adminCreateProduct = (data) => api.post("/admin/products", data);
export const uploadImages = (formData) => api.post("/upload", formData, { headers: { "Content-Type": "multipart/form-data" },});
export const  adminUpdateProduct = (id, data) => api.put(`/admin/products/${id}`, data);
export const  adminDeleteProduct = (id) => api.delete(`/admin/products/${id}`);
export const  adminGetProducts = () => api.get("/admin/products");
export const  adminGetProductById = (id) => api.get(`/admin/products/${id}`);
export const adminGetAnalytics = () => api.get("/admin/analytics");
export const getCategories = () => api.get("/categories");
export const getSubCategories = (id) => api.get(`/categories/${id}`);
export const adminGetUsers = () => api.get("/admin/users");
export const adminGetUserById = (id) => api.get(`/admin/users/${id}`);
export const adminUpdateUser = (id, data) => api.put(`/admin/users/${id}`, data);
export const adminDeleteUser = (id) => api.delete(`/admin/users/${id}`);
export const adminCreateUser = (data) => api.post("/admin/users", data);
export const adminGetOrders = () => api.get("/admin/orders");
export const adminGetOrderById = (id) => api.get(`/admin/orders/${id}`);
export const adminUpdateOrder = (id, data) => api.put(`/admin/orders/${id}`, data);
export const adminDeleteOrder = (id) => api.delete(`/admin/orders/${id}`);
export const adminGetComplaints = () => api.get("/admin/complaints");
export const adminGetComplaintById = (id) => api.get(`/admin/complaints/${id}`);

export const checkOrderStatus = (id) => api.get(`/orders/${id}`);
export const getComplaints = () => api.get("/complaints");
export const createComplaint = (data) => api.post("/complaints", data);

export const getAddresses = () => api.get("/addresses");
export const addAddress = (data) => api.post("/addresses", data);

export default {
  register,
    verify,
    resend,
    forgot,
    reset,
  login,
  getProfile,
  getProducts,
  getProductById,
    searchProducts,
    getProductsByCategory,
adminCreateProduct,
    adminUpdateProduct,
    uploadImages,
    adminDeleteProduct,
    adminGetProducts,
    adminGetProductById,
    adminGetAnalytics,
    getCategories,
    getSubCategories,
    adminGetUsers,
    adminGetUserById,
    adminUpdateUser,
    adminDeleteUser,
    adminCreateUser,
    adminGetOrders,
    adminGetOrderById,
    adminUpdateOrder,
    adminDeleteOrder,
    adminGetComplaints,
    adminGetComplaintById,
  getCart,
  addToCart,
  removeFromCart,
    updateCartItem,
  getOrders,
  createOrder,
  makePayment,
  getAdminDashboard, checkOrderStatus,
  getComplaints,
  createComplaint,
  getAddresses,
  addAddress,
};
