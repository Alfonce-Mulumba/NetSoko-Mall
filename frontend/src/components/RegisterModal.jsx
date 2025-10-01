import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import api from "../../../utils/api";
import VerifyModal from "./VerifyModal";

const COUNTRIES = [
  { code: "+254", label: "Kenya" },
  { code: "+1", label: "United States" },
  { code: "+44", label: "United Kingdom" },
  { code: "+233", label: "Ghana" },
  { code: "+254", label: "Kenya" },
];

export default function RegisterModal({ open, setOpen }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", countryCode: "+254", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // combine country code + phone
      const payload = {
        name: form.name,
        email: form.email,
        phone: `${form.countryCode}${form.phone.replace(/^\+/, "").replace(/\s+/g, "")}`,
        password: form.password,
      };

      const res = await api.post("/auth/register", payload);
      // API returns message + user (no token until verification)
      // Open verify modal for the provided email
      setVerifyEmail(form.email);
      setShowVerify(true);

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child as={Fragment}
              enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
                <Dialog.Title className="text-lg font-semibold mb-3">Create an account</Dialog.Title>

                {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded mb-3">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input name="name" value={form.name} onChange={handleChange} required
                    className="w-full border rounded px-3 py-2" placeholder="Full name" />

                  <input name="email" value={form.email} onChange={handleChange} required type="email"
                    className="w-full border rounded px-3 py-2" placeholder="Email address" />

                  <div className="flex gap-2">
                    <select name="countryCode" value={form.countryCode} onChange={handleChange}
                      className="border rounded px-3 py-2">
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>{c.label} ({c.code})</option>
                      ))}
                    </select>
                    <input name="phone" value={form.phone} onChange={handleChange} required
                      className="flex-1 border rounded px-3 py-2" placeholder="Phone number (no leading +)" />
                  </div>

                  <input name="password" value={form.password} onChange={handleChange} required type="password"
                    className="w-full border rounded px-3 py-2" placeholder="Choose a password" />

                  <div className="flex items-center justify-between">
                    <button type="button" onClick={() => setOpen(false)} className="px-3 py-2 rounded-md">Cancel</button>
                    <button type="submit" disabled={loading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-60">
                      {loading ? "Creating..." : "Create account"}
                    </button>
                  </div>
                </form>

                <p className="text-sm text-gray-500 mt-3">
                  By creating an account you agree to our Terms & Privacy.
                </p>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <VerifyModal open={showVerify} setOpen={setShowVerify} email={verifyEmail} onCloseParent={() => { setOpen(false); }} />
    </>
  );
}
