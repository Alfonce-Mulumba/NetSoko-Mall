import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const nav = useNavigate();

const submit = async (e) => {
  e.preventDefault();
  try {
    const res = await register(form); // from AuthContext
    // instead of alert, redirect to verify page
    nav("/verify", { state: { email: form.email } });
  } catch (err) {
    alert(err?.response?.data?.message || "Error registering");
  }
};


  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded">
      <h2 className="text-xl font-bold mb-3">Create account</h2>
      <form onSubmit={submit} className="space-y-3">
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Full name"
          className="w-full p-2 border rounded"
        />
        <input
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <input
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="+2547..."
          className="w-full p-2 border rounded"
        />
        <input
          required
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
