import React, { useEffect, useState } from "react";
import api from "../api/index.js";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔧 Helper: normalize image field
  const parseImage = (images) => {
    if (!images) return "/placeholder.png";
    try {
      if (typeof images === "string") {
        // Prisma may store as stringified JSON
        const parsed = JSON.parse(images);
        return parsed?.[0]?.url || parsed?.[0] || "/placeholder.png";
      }
      // Already an array (either strings or objects with url)
      return images?.[0]?.url || images?.[0] || "/placeholder.png";
    } catch {
      return "/placeholder.png";
    }
  };

  // Fetch user's orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.getOrders();
        setOrders(res.data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-700 dark:text-gray-300">
        Loading your orders...
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-700 dark:text-gray-300">
        You have no orders yet.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        My Orders
      </h2>

      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm text-left bg-white dark:bg-gray-900 border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase">
            <tr>
              <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700">
                Order ID
              </th>
              <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700">
                Item
              </th>
              <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700">
                Qty
              </th>
              <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700">
                Price
              </th>
              <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-right">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) =>
              order.orderItems.map((item, idx) => {
                const imgSrc = parseImage(item.product?.images);

                return (
                  <tr
                    key={`${order.id}-${item.id}`}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    {/* Order ID only once per order */}
                    {idx === 0 && (
                      <td
                        rowSpan={order.orderItems.length}
                        className="py-3 px-4 font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700"
                      >
                        #{order.id}
                      </td>
                    )}

                    {/* Product details */}
                    <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <img
                          src={imgSrc}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded border border-gray-300 dark:border-gray-700"
                          onError={(e) => (e.target.src = "/placeholder.png")}
                        />
                        <span className="text-gray-800 dark:text-gray-200">
                          {item.product.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                      {item.quantity}
                    </td>

                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                      Ksh {item.price * item.quantity}
                    </td>

                    {/* Status only once per order */}
                    {idx === 0 && (
                      <td
                        rowSpan={order.orderItems.length}
                        className={`py-3 px-4 text-right font-medium border-b border-gray-200 dark:border-gray-700 ${
                          order.status === "delivered"
                            ? "text-green-600"
                            : order.status === "pending"
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                      >
                        {order.status}
                      </td>
                    )}
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
