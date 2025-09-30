// src/pages/admin/AdminLayout.jsx
import React, { useContext, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function AdminLayout() {
  const { user } = useContext(AuthContext);
  const nav = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      nav("/"); // redirect non-admins
    }
  }, [user, nav]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin</h2>
        <nav className="space-y-3">
          <Link to="/admin" className="block hover:underline">Dashboard</Link>
          <Link to="/admin/products" className="block hover:underline">Manage Products</Link>
          <Link to="/admin/orders" className="block hover:underline">Manage Orders</Link>
          <Link to="/admin/users" className="block hover:underline">Manage Users</Link>
          <Link to="/admin/analytics" className="block hover:underline">Analytics</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
