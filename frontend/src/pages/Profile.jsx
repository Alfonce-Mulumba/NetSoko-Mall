import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-700 dark:text-gray-300">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition p-6 md:p-10">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          My Profile
        </h1>

        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role || "Customer"}</p>
        </div>

        <button
          onClick={logout}
          className="mt-6 bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
