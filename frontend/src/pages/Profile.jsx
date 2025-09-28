import React from "react";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return <div>Not logged in</div>;
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="bg-white p-4 rounded">
        <div><strong>Name:</strong> {user.name}</div>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Role:</strong> {user.role}</div>
      </div>
    </div>
  );
}
