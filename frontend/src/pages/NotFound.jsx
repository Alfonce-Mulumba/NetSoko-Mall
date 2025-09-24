import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="h-64 flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-brand mb-2">404</h1>
      <p className="text-gray-600 mb-4">Page not found</p>
      <Link to="/" className="px-4 py-2 bg-brand text-white rounded">Back home</Link>
    </div>
  );
}
