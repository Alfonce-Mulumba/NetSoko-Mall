// fallback includes trailing /api so endpoints like "/auth/login" become ".../api/auth/login"
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log("🌐Using API Base URL:", API_BASE_URL);

export default API_BASE_URL;