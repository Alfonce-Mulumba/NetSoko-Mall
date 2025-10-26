import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import logoBlack from "../assets/logoBlack.jpg";

export default function RegisterPage() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await register(form);
      setLoading(false);
      toast.success("Registration successful. Verification code sent to your email! Consider checking your spam folder");
      nav("/verify", { state: { email: form.email } });
    } catch (err) {
      setLoading(false);
      const msg = err?.response?.data?.message || "Error registering";
      toast.error(`❌ ${msg}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-100 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl w-full max-w-md p-8 relative">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logoBlack}
            alt="NetSoko Logo"
            className="w-16 h-16 rounded-full shadow-md object-cover"
          />
        </div>

        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-gray-100">
          Create Account
        </h2>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-600 dark:text-purple-400 font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>

        <form onSubmit={submit} className="space-y-4">
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full name"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400"
          />
          <input
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400"
          />
          <input
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+2547..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400"
          />
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl shadow hover:opacity-90 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
