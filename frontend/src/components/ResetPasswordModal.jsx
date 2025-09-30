// frontend/src/components/auth/ResetPasswordModal.jsx
import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import api from "../api/index.js";

export default function ResetPasswordModal({ open, setOpen, email, parentClose }) {
  const [form, setForm] = useState({ code: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const nav = useNavigate();

  if (!email) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      // expects backend endpoint /auth/reset { email, code, password }
      await api.reset({ email, token: form.code, newPassword: form.password });
       setShowSuccess(true);
      setOpen(false);
      if (parentClose) parentClose(false);
    } catch (err) {
      console.error("Reset error:", err);
      console.error("Response data:", err.response?.data);
      setMessage(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Reset form modal */}
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
                <Dialog.Title className="text-lg font-medium mb-3">Enter reset code</Dialog.Title>

                {message && <div className="text-sm text-red-700 bg-red-50 p-2 rounded mb-3">{message}</div>}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input name="code" value={form.code} onChange={(e)=>setForm({...form, code: e.target.value})} required
                    placeholder="Reset code" className="w-full border rounded px-3 py-2" />
                  <input name="password" value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} required type="password"
                    placeholder="New password" className="w-full border rounded px-3 py-2" />

                  <div className="flex justify-between items-center">
                    <button type="button" onClick={() => setOpen(false)} className="px-3 py-2 rounded">Cancel</button>
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">
                      {loading ? "Resetting..." : "Reset password"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* ✅ Success confirmation */}
      <Transition show={showSuccess} as={Fragment}>
        <Dialog className="relative z-50" onClose={() => setShowSuccess(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg text-center">
              <Dialog.Title className="text-lg font-bold mb-3">Password Reset Successful</Dialog.Title>
              <p className="text-gray-700 mb-4">Your password has been updated. Please log in with your new credentials.</p>
              <button
                onClick={() => { setShowSuccess(false); nav("/login"); }}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Ok, proceed
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}