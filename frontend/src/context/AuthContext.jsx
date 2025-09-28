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

  useEffect(() => {
    if (token) {
      const usr = JSON.parse(localStorage.getItem("user") || "null");
      setUser(usr);
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    const res = await api.login({ email, password });
    const { token: t, user: u } = res.data;
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
    setToken(t);
    setUser(u);
    setLoading(false);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    nav("/");
  };

const register = async (payload) => {
  setLoading(true);
  try {
    const res = await api.register(payload);
    setLoading(false);
    return res.data;
  } catch (err) {
    setLoading(false);
    throw new Error(
      err?.response?.data?.message || "Registration failed"
    );
  }
};

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    setToken,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
