// src/api/config.js
const API_URL =
  import.meta.env.VITE_API_URL || "https://netsoko-mall.onrender.com";

export default {
  BASE_URL: `${API_URL}/api`,
};
