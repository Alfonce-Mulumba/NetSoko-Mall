import React from "react";
import { useApp } from "../context/AppContext";

export default function Toast() {
  const { toast, clearToast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white shadow-lg rounded-lg p-4 border flex items-start gap-3">
        <div className="text-brand font-semibold">{toast.title}</div>
        <div className="text-sm text-gray-600">{toast.message}</div>
        <button className="ml-3 text-gray-500" onClick={clearToast}>×</button>
      </div>
    </div>
  );
}
