// frontend/src/pages/admin/ManageUsers.jsx
import React, { useEffect, useState } from "react";
import useAdminAuth from "../../hooks/useAdminAuth";
import api from "../../utils/api";

export default function ManageUsers() {
  const { loading, isAdmin } = useAdminAuth();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  if (loading) return <p>Loading...</p>;
  if (!isAdmin) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">👥 Manage Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="space-y-2">
          {users.map((u) => (
            <li
              key={u.id}
              className="flex justify-between items-center border-b py-2"
            >
              <span>
                {u.name} ({u.email}) – <strong>{u.role}</strong>
              </span>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => deleteUser(u.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
