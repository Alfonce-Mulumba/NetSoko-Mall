import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useApp } from "../context/AppContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, setToastMessage } = useApp();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", { name, email, password });
      const { user, token } = res.data || {};
      if (user && token) {
        login(user, token);
        navigate("/");
      } else {
        // fallback
        const fallbackUser = { name, email };
        login(fallbackUser, "demo-token");
        setToastMessage({ title: "Registered", message: `Welcome ${name}` });
        navigate("/");
      }
    } catch (err) {
      setToastMessage({ title: "Register failed", message: err?.response?.data?.message || "Could not register" });
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Create account</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full border p-3 rounded" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full border p-3 rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="w-full border p-3 rounded" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full py-3 bg-brand text-white rounded">Create account</button>
      </form>
    </div>
  );
}
