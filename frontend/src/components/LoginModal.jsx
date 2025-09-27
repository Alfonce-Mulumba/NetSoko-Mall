// frontend/src/components/auth/LoginModal.jsx
import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import api from "../../../utils/api";
import ForgotPasswordModal from "./ForgotPasswordModal";

export default function LoginModal({ open, setOpen }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotOpen, setForgotOpen] = useState(false);

  const handleChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email: form.email, password: form.password });
      // expected { token, user }
      const token = res.data.token;
      const user = res.data.user;
      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", user.role || "customer");
        setOpen(false);
        window.location.reload();
      } else {
        setError("Login succeeded but server didn't return token/user.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Transition show={open} as={Fragment}>
        <Dialog className="relative z-50" onClose={() => setOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child as={Fragment}
              enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
                <Dialog.Title className="text-lg font-medium mb-3">Sign in to NetSoko</Dialog.Title>

                {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded mb-3">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input name="email" type="email" value={form.email} onChange={handleChange} required
                    className="w-full border rounded px-3 py-2" placeholder="Email" />
                  <input name="password" type="password" value={form.password} onChange={handleChange} required
                    className="w-full border rounded px-3 py-2" placeholder="Password" />

                  <div className="flex items-center justify-between">
                    <button type="button" onClick={() => setOpen(false)} className="px-3 py-2 rounded">Cancel</button>
                    <div className="flex gap-2">
                      <button type="button" onClick={()=>setForgotOpen(true)} className="text-sm text-indigo-600">Forgot password?</button>
                      <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">
                        {loading ? "Signing in..." : "Sign in"}
                      </button>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <ForgotPasswordModal open={forgotOpen} setOpen={setForgotOpen} />
    </>
  );
}
