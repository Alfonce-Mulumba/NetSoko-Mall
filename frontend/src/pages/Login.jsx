import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import ForgotPasswordModal from "../components/ForgotPasswordModal.jsx";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="max-w-md mx-auto bg-white p-6 rounded">
      <h2 className="text-xl font-bold mb-3">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 border rounded" placeholder="Email" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2 border rounded" placeholder="Password" />
        <div className="flex justify-between items-center">
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Login</button>
           <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-gray-600 underline"
          >
            Forgot?
          </button>
        </div>
      </form>

      {showForgotPassword && (
        <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
      )}
    </div>
  );
}
