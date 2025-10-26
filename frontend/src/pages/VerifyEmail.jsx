import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/index.js";
import { toast } from "react-toastify";
import logoBlack from "../assets/logoBlack.jpg";

export default function VerifyEmail() {
  const { state, search } = useLocation();
  const query = new URLSearchParams(search);
  const email = state?.email || query.get("email") || "";
  const nav = useNavigate();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (email) {
      // Auto resend code on page load
      api.resend({ email })
        .then(() => toast.info("📨 Verification code sent automatically."))
        .catch((err) => console.error("Auto resend error:", err));
    }
  }, [email]);

  const verify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.verify({ email, code });
      toast.success("✅ Email verified! Redirecting to login...");
      setTimeout(() => nav("/login"), 1500);
    } catch (err) {
      console.error("Verify error:", err);
      toast.error(err?.response?.data?.message || "❌ Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      await api.resend({ email });
      toast.info("📨 A new verification code has been sent.");
    } catch (err) {
      console.error("Resend error:", err);
      toast.error(err?.response?.data?.message || "❌ Failed to resend code");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logoBlack} alt="Logo" className="w-16 h-16 rounded-full mb-3" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Your Email</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
            Verification code sent to <b>{email}</b>
          </p>
        </div>

        <form onSubmit={verify} className="space-y-4">
          <input
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter verification code"
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
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
