import React, { useEffect, useState } from "react";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/admin/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setOrders(data);
  };

  const updateOrder = async (id, status) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/admin/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>📦 Manage Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((o) => (
            <li key={o.id}>
              Order #{o.id} - {o.status} - {o.user?.email}
              <button onClick={() => updateOrder(o.id, "shipped")}>Mark Shipped</button>
              <button onClick={() => updateOrder(o.id, "completed")}>Mark Completed</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageOrders;
