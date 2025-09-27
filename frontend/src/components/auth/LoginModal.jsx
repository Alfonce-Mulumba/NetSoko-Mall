import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utils/api";

export default function LoginModal({ open, setOpen }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!open) return null;
  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const { token, user } = res.data;
      login(token, user);
      setOpen(false);
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 p-6">
        <h3 className="text-lg font-semibold mb-4">Login</h3>
        <form onSubmit={submit} className="space-y-3">
          <input required value={email} onChange={e=>setEmail(e.target.value)}
            placeholder="Email" className="w-full input" />
          <input required type="password" value={password} onChange={e=>setPassword(e.target.value)}
            placeholder="Password" className="w-full input" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={()=>setOpen(false)} className="px-3 py-1">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}
