import { createContext, useState, useEffect } from "react";
import { publicApi } from "../api/index.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  // Save user/token in localStorage
  const saveAuth = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    setToken(token);
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await publicApi.register(formData);
      const { user: u, token } = res.data;
      saveAuth(u, token);
      setLoading(false);
      return { user: u };
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await publicApi.login({ email, password });
      const { user: u, token } = res.data;
      saveAuth(u, token);
      setLoading(false);
      return { user: u };
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    window.location.replace("/login");
  };

  useEffect(() => {
    // Optional: fetch profile on load if token exists
    const fetchProfile = async () => {
      if (token && !user) {
        try {
          const res = await publicApi.get("/auth/profile");
          setUser(res.data);
        } catch (err) {
          logout();
        }
      }
    };
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
