import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [userRes, addrRes, orderRes] = await Promise.allSettled([
          api.get("/auth/profile"),
          api.get("/addresses"),
          api.get("/orders"),
        ]);

        if (userRes.status === "fulfilled") setUser(userRes.value.data);
        if (addrRes.status === "fulfilled") setAddresses(addrRes.value.data || []);
        if (orderRes.status === "fulfilled") {
          const data = orderRes.value.data || [];
          setOrders(data);
          setActiveOrders(data.filter((o) => o.status?.toLowerCase() === "active"));
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout").catch(() => {});
    } catch (err) {
      console.warn("Logout request failed:", err?.message);
    } finally {
      localStorage.clear();
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition">
      <h2 className="text-2xl text-green-600 font-bold mb-6">My Profile</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 🧍 User Details */}
        <div className="p-4 rounded-2xl shadow bg-white dark:bg-gray-800">
          <h3 className="text-lg text-green-500 font-semibold mb-2">User Details</h3>
          {user ? (
            <ul className="space-y-1 text-sm">
              <li><strong>Name:</strong> {user.name}</li>
              <li><strong>Email:</strong> {user.email}</li>
              <li><strong>Phone:</strong> {user.phone || "N/A"}</li>
              <li><strong>Role:</strong> {user.role}</li>
            </ul>
          ) : (
            <p className="text-gray-500">No user information available.</p>
          )}
        </div>

        {/* 🏠 Address List */}
        <div className="p-4 rounded-2xl shadow bg-white dark:bg-gray-800">
          <h3 className="text-lg text-green-500 font-semibold mb-2">Addresses</h3>
          {addresses.length > 0 ? (
            addresses.map((a, i) => (
              <div
                key={i}
                className="border-b border-gray-700/10 dark:border-gray-700 pb-2 mb-2 text-sm"
              >
                <p><strong>Street: </strong>{a.address}</p>
                <p><strong>Country: </strong>{a.country}</p>
                <p><strong>City: </strong>{a.city}</p>
                <p><strong>Phone: </strong>{a.phone}</p>
                {a.isDefault && (
                  <span className="text-xs text-blue-500 font-medium">Default</span>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No addresses saved yet.</p>
          )}
        </div>

        {/* 📦 Combined Orders */}
        <div className="md:col-span-2 p-4 rounded-2xl shadow bg-white dark:bg-gray-800 overflow-x-auto">
          <h3 className="text-lg text-green-500 font-semibold mb-3">Orders</h3>
          {orders.length > 0 ? (
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100 dark:bg-gray-700 text-left text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="p-2">Order ID</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Product(s)</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
                  >
                    <td className="p-2 font-medium">#{o.id}</td>
                    <td className="p-2">
                      {new Date(o.createdAt).toLocaleDateString("en-KE", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-2">
                      {o.orderItems?.length
                        ? o.orderItems
                            .map((item) => item.product?.name || "Unnamed Product")
                            .join(", ")
                        : "—"}
                    </td>
                    <td className="p-2">
                      $
                      {o.total ??
                        o.orderItems?.reduce(
                          (sum, item) =>
                            sum + item.quantity * (item.product?.price || 0),
                          0
                        ) ??
                        0}
                    </td>
                    <td
                      className={`p-2 font-medium ${
                        o.status?.toLowerCase() === "active"
                          ? "text-blue-500"
                          : o.status?.toLowerCase() === "delivered"
                          ? "text-green-500"
                          : o.status?.toLowerCase() === "cancelled"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {o.status || "unknown"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No orders found.</p>
          )}
        </div>
      </div>

      {/* 🚪 Logout */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
