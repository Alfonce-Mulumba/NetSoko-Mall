import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/index.js";

export default function VerifyEmail() {
  const { state } = useLocation();
  const email = state?.email || "";
  const nav = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const verify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.verify({ email, code });
      setMessage("✅ Verified! You can now log in.");
      setTimeout(() => nav("/login"), 1500);
    } catch (err) {
      setMessage(err?.response?.data?.message || "❌ Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      await api.resend({ email });
      setMessage("📨 A new code has been sent to your email.");
    } catch (err) {
      setMessage(err?.response?.data?.message || "❌ Failed to resend code");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded">
      <h2 className="text-xl font-bold mb-3">Enter verification code</h2>
      <p className="text-gray-600 mb-4">Verification code sent to {email}</p>
      {message && <p className="mb-2 text-sm text-red-600">{message}</p>}
      <form onSubmit={verify} className="space-y-3">
        <input
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter verification code"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </form>
      <button
        onClick={resendCode}
        className="mt-4 text-sm text-blue-600 hover:underline"
      >
        Resend code
      </button>
    </div>
  );
}
