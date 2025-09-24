import React from "react";
import { useApp } from "../context/AppContext";

export default function Profile() {
  const { user } = useApp();

  if (!user) return <div className="text-center py-16">Please login to view your profile.</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
      <div className="space-y-2">
        <div><strong>Name:</strong> {user.name}</div>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Phone:</strong> {user.phone || "-"}</div>
      </div>
    </div>
  );
}
