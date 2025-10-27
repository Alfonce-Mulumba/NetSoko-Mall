// components/Spinner.jsx
import React from "react";

export default function Spinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[9999]">
      <div className="w-16 h-16 border-4 border-t-purple-500 border-gray-200 rounded-full animate-spin"></div>
    </div>
  );
}
