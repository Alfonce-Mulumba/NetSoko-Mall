import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import ForgotPasswordModal from "../components/ForgotPasswordModal.jsx";
import logoBlack from "../assets/logoBlack.jpg"; // 👈 import your logo

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      nav("/");
    } catch (err) {
      alert(err?.response?.data?.message || "Error logging in");
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

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-gray-100">
          Login
        </h2>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-purple-600 dark:text-purple-400 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400"
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400"
            placeholder="Password"
          />

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl shadow hover:opacity-90 transition"
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              Forgot?
            </button>
          </div>
        </form>

        {/* Forgot Password Modal */}
        <ForgotPasswordModal
          open={showForgotPassword}
          setOpen={setShowForgotPassword}
        />
      </div>
    </div>
  );
}
