import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import api from "../../../utils/api.js";
import logoBlack from "../../../assets/logoBlack.jpg";

export default function VerifyModal({ open, setOpen, email, onCloseParent }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!email) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/verify", { email, code });
      const token = res.data.token;
      const user = res.data.user;
      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", user.role || "customer");
        setOpen(false);
        if (onCloseParent) onCloseParent();
        window.location.reload();
      } else {
        setError("Verification succeeded but token/user not returned by server.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.post("/auth/register", {
        name: "resend",
        email,
        phone: "",
        password: "placeholder123",
      });
    } catch (err) {}
  };

  return (
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
          <div className="fixed inset-0 bg-black/40" />
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
            <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="flex flex-col items-center mb-4">
                <img src={logoBlack} alt="Logo" className="w-14 h-14 rounded-full mb-3" />
                <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
                  Verify your email
                </Dialog.Title>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  We sent a verification code to <b>{email}</b>. Enter code below.
                </p>
              </div>

              {error && (
                <div className="text-sm text-red-700 bg-red-50 dark:bg-red-900 dark:text-red-300 p-2 rounded mb-3">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-4">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  placeholder="Enter verification code"
                  className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700 
                             border-gray-300 dark:border-gray-600 
                             text-gray-900 dark:text-gray-100"
                />

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleResend}
                      className="px-3 py-2 text-sm text-primary hover:underline"
                    >
                      Resend
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      {loading ? "Verifying..." : "Verify"}
                    </button>
                  </div>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
