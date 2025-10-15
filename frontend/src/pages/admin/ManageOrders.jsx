import React, { useEffect, useState } from "react";
import api from "../../api";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState({}); // Tracks changed statuses

  // Fetch all orders (admin)
  useEffect(() => {
    (async () => {
      try {
        const res = await api.adminGetAllOrders(); // <-- connected to getAllOrders backend
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    })();
  }, []);

  // Handle status selection change
  const handleStatusChange = (orderId, newStatus) => {
    setEditing((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  // Save new status to backend
  const saveStatus = async (orderId) => {
    const newStatus = editing[orderId];
    if (!newStatus) return;

    try {
      await api.adminUpdateOrder(orderId, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setEditing((prev) => {
        const copy = { ...prev };
        delete copy[orderId];
        return copy;
      });
      alert("✅ Order status updated successfully!");
    } catch (err) {
      console.error("Error updating order:", err);
      alert("❌ Failed to update order status.");
    }
  };

  return (
    <div className="p-6 text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-6">Manage Orders</h2>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="min-w-full text-left border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">User Email</th>
              <th className="p-3">Total</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const total = order.orderItems?.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                );
                return (
                  <tr
                    key={order.id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40"
                  >
                    <td className="p-3">{order.id}</td>
                    <td className="p-3">{order.user?.email || "—"}</td>
                    <td className="p-3">${total?.toFixed(2)}</td>
                    <td className="p-3">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <select
                        value={editing[order.id] ?? order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3 text-center">
                      {editing[order.id] &&
                      editing[order.id] !== order.status ? (
                        <button
                          onClick={() => saveStatus(order.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Save
                        </button>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
