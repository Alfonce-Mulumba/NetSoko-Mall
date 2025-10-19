import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});


// Example endpoints
export const getProducts = () => api.get("/products");
export const getCart = () => api.get("/cart");
export const login = (data) => api.post("/auth/login", data);

export default {
  getProducts,
  getCart,
  login,
};
