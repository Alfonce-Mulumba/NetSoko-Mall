import { createContext, useState, useEffect } from "react";
import api from "../api/index.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(() => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch (err) {
    console.warn("Failed to parse user from localStorage", err);
    return null;
  }
});

const [token, setToken] = useState(() => {
  try {
    return localStorage.getItem("token");
  } catch (err) {
    return null;
  }
});

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
      const res = await api.register(formData);
      const user = res.data.user;
      setLoading(false);
      return { user };
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password });
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
          const res = await api.get("/auth/profile");
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
