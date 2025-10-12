import React, { createContext, useState, useEffect } from "react";
import api from "../api/index.js";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const nav = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  // ✅ Prevent unnecessary re-navigation loops
  useEffect(() => {
    if (token && !user) {
      try {
        const usr = JSON.parse(localStorage.getItem("user") || "null");
        setUser(usr);
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      const { token: t, user: u } = res.data;

      localStorage.setItem("token", t);
      localStorage.setItem("user", JSON.stringify(u));
      setToken(t);
      setUser(u);
      return res.data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // ✅ Clean up first before navigating
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);

    // ✅ Use replace to avoid stacking history and looping
    nav("/login", { replace: true });
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const res = await api.register(payload);
      return res.data;
    } catch (err) {
      throw new Error(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, register, setToken, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
