// src/api/config.js
function normalizeBaseUrl(url) {
  if (!url) return "http://localhost:5000/api";
  // remove trailing slash
  url = url.replace(/\/+$/, "");
  // if it already ends with /api, return it; otherwise append /api
  return url.endsWith("/api") ? url : '${url}/api';
}

const envUrl = import.meta.env.VITE_API_URL; // from Render or local .env
const API_BASE_URL = normalizeBaseUrl(envUrl);

export default API_BASE_URL;