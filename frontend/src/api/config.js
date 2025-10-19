// config.js
export const BASE_URL = "https://netsoko-mall.onrender.com/api";

import axios from "axios";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Optional: add auth headers and interceptors if needed
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
