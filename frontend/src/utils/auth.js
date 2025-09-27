// frontend/src/utils/auth.js
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  window.location.href = "/"; // redirect to home
};
