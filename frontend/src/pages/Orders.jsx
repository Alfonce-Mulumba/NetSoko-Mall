import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/orders/my");
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-green-600">My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600">You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              <p className="font-semibold text-green-700">
                Order #{order._id.slice(-6)}
              </p>
              <p>Status: {order.status}</p>
              <p>Total: KES {order.totalPrice}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
