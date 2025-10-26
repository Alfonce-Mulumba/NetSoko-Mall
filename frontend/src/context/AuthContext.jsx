import { createContext, useState, useEffect } from "react";
import api from "../api/index.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

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
    setLoading(false);
    return { user: res.data.user };
  } catch (err) {
    setLoading(false);
    console.error("Register error:", err.response?.data || err);
    throw err;
  }
};


const login = async (email, password) => {
  setLoading(true);
  try {
    const res = await api.login({ email, password });
    const { user: u, token } = res.data;

    if (!u.is_verified) {
      // Already handled by backend? Just return unverified
      await api.resend({ email }).catch(err => console.error("Auto resend error:", err));
      setLoading(false);
      return { unverified: true, email: u.email };
    }

    saveAuth(u, token);
    setLoading(false);
    return { user: u };

  } catch (err) {
    // Handle 403 unverified explicitly
    if (err.response?.status === 403) {
      const emailFromResponse = err.response?.data?.email || email;
      await api.resend({ email: emailFromResponse }).catch(err2 => console.error("Auto resend error:", err2));
      setLoading(false);
      return { unverified: true, email: emailFromResponse };
    }

    setLoading(false);
    console.error("Login error:", err);
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
    if (token && !user) {
      const fetchProfile = async () => {
        try {
          const res = await api.get("/auth/profile");
          setUser(res.data);
        } catch {
          logout();
        }
      };
      fetchProfile();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
