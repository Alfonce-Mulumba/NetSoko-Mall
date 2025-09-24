import React, { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders")
      .then(res => setOrders(res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  if (!orders.length) return <div className="text-center py-16">No orders yet.</div>;

  return (
    <div className="space-y-4">
      {orders.map(o => (
        <div key={o.id} className="bg-white p-4 rounded shadow">
          <div className="flex justify-between">
            <div>Order #{o.orderNumber || o.id}</div>
            <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</div>
          </div>
          <div className="mt-2">Status: <span className="font-semibold">{o.status}</span></div>
        </div>
      ))}
    </div>
  );
}
