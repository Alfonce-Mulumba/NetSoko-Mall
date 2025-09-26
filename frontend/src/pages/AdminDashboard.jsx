import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-green-600">
        Admin Dashboard
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Link
          to="/admin/products"
          className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition"
        >
          <h3 className="font-bold text-green-600">Manage Products</h3>
          <p className="text-gray-500 text-sm">Add, edit, or delete products.</p>
        </Link>
        <Link
          to="/admin/users"
          className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition"
        >
          <h3 className="font-bold text-green-600">Manage Users</h3>
          <p className="text-gray-500 text-sm">View and manage users.</p>
        </Link>
        <Link
          to="/admin/orders"
          className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition"
        >
          <h3 className="font-bold text-green-600">Manage Orders</h3>
          <p className="text-gray-500 text-sm">Track and update orders.</p>
        </Link>
        <Link
          to="/admin/analytics"
          className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition"
        >
          <h3 className="font-bold text-green-600">Analytics</h3>
          <p className="text-gray-500 text-sm">View sales reports.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
