import React, { createContext, useState, useEffect } from "react";
import axios from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("net-soko-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (credentials) => {
    const { data } = await axios.post("/api/auth/login", credentials);
    setUser(data.user);
    localStorage.setItem("net-soko-user", JSON.stringify(data.user));
    return data;
  };

  const register = async (details) => {
    const { data } = await axios.post("/api/auth/register", details);
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("net-soko-user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
