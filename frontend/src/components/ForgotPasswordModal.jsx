// frontend/src/components/auth/ForgotPasswordModal.jsx
import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import api from "../../../utils/api";
import ResetPasswordModal from "./ResetPasswordModal";

export default function ForgotPasswordModal({ open, setOpen }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showReset, setShowReset] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      // expects backend to accept /auth/forgot { email } and send reset code
      await api.post("/auth/forgot", { email });
      setMessage("If this email exists a reset code was sent. Check your inbox.");
      setShowReset(true);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to request reset. Try again later.");
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
                <Dialog.Title className="text-lg font-medium mb-3">Reset password</Dialog.Title>

                {message && <div className="text-sm text-green-700 bg-green-50 p-2 rounded mb-3">{message}</div>}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required
                    placeholder="Your account email" className="w-full border rounded px-3 py-2" />

                  <div className="flex justify-between items-center">
                    <button type="button" onClick={() => setOpen(false)} className="px-3 py-2 rounded">Cancel</button>
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">
                      {loading ? "Sending..." : "Send reset code"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* After sending code, show reset modal */}
      <ResetPasswordModal open={showReset} setOpen={setShowReset} email={email} parentClose={setOpen} />
    </>
  );
}
