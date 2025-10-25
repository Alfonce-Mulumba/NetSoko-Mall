import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/index.js";
import logoBlack from "../assets/logoBlack.jpg";

export default function VerifyEmail() {
  const { state } = useLocation();
  const email = state?.email || "";
  const nav = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Updated verify function to POST { email, code } to backend
  const verify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/verify", { email, code }); // <- POST request
      setMessage("✅ Verified! You can now log in.");
      setTimeout(() => nav("/login"), 1500);
    } catch (err) {
      setMessage(err?.response?.data?.message || "❌ Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Updated resend function to match backend route
  const resendCode = async () => {
    try {
      await api.post("/auth/resend-otp", { email }); // <- POST request matching backend route
      setMessage("📨 A new code has been sent to your email.");
    } catch (err) {
      setMessage(err?.response?.data?.message || "❌ Failed to resend code");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logoBlack} alt="Logo" className="w-16 h-16 rounded-full mb-3" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Verify Your Email
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
            Verification code sent to <b>{email}</b>
          </p>
        </div>

        {message && (
          <p
            className={`mb-4 text-sm p-2 rounded ${
              message.startsWith("✅") || message.startsWith("📨")
                ? "text-green-700 bg-green-50 dark:bg-green-900 dark:text-green-300"
                : "text-red-700 bg-red-50 dark:bg-red-900 dark:text-red-300"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={verify} className="space-y-4">
          <input
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter verification code"
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700
                       border-gray-300 dark:border-gray-600
                       text-gray-900 dark:text-gray-100"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <button
          onClick={resendCode}
          className="mt-4 w-full text-sm font-medium text-primary hover:underline"
        >
          Resend code
        </button>
      </div>
    </div>
  );
}