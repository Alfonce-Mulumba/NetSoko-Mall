import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import api from "../api/index.js";
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
      await api.forgot({ email });
      setMessage(
        "If this email exists a reset code was sent. Check your inbox (and spam)."
      );
      setShowReset(true);
    } catch (err) {
      console.error("Reset error:", err);
      console.error("Response data:", err.response?.data);
      setMessage(
        err.response?.data?.message ||
          "Failed to request reset. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Transition show={open} as={Fragment}>
        <Dialog className="relative z-50" onClose={() => setOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-gray-200 dark:border-gray-700">
                <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Reset password
                </Dialog.Title>

                {message && (
                  <div
                    className={`text-sm p-2 rounded mb-3 ${
                      /failed|error/i.test(message)
                        ? "text-red-700 bg-red-50 dark:bg-red-900/40 dark:text-red-300"
                        : "text-green-700 bg-green-50 dark:bg-green-900/30 dark:text-green-200"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    placeholder="Your account email"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400"
                  />

                  <div className="flex justify-end items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="px-4 py-2 rounded-md text-sm border border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium shadow-sm disabled:opacity-60"
                    >
                      {loading ? "Sending..." : "Send reset code"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <ResetPasswordModal
        open={showReset}
        setOpen={setShowReset}
        email={email}
        parentClose={setOpen}
      />
    </>
  );
}
