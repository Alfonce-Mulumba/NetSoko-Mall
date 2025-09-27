import React from "react";
import { motion } from "framer-motion";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        {user ? (
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
        ) : <p>Please login to view profile.</p>}
      </motion.div>
    </div>
  );
}
