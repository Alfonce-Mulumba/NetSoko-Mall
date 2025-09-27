import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h1 className="text-xl font-bold mb-6">Admin</h1>
        <nav className="flex flex-col gap-3 text-sm">
          <Link to="/admin" className="hover:underline">Overview</Link>
          <Link to="/admin/products" className="hover:underline">Products</Link>
          <Link to="/admin/users" className="hover:underline">Users</Link>
          <Link to="/admin/orders" className="hover:underline">Orders</Link>
          <Link to="/admin/analytics" className="hover:underline">Analytics</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
