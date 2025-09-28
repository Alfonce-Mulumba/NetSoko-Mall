import React, { useEffect, useState } from "react";
import api from "../api/index.js";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(()=> {
    (async ()=> {
      const res = await api.getOrders();
      setOrders(res.data);
    })();
  },[]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {orders.length === 0 ? <p>No orders yet.</p> : (
        <div className="space-y-3">
          {orders.map(o => (
            <div key={o.id} className="bg-white p-3 rounded">
              <div className="flex justify-between">
                <div>Order #{o.id}</div>
                <div className="text-sm text-gray-600">{o.status}</div>
              </div>
              <div className="mt-2">
                {o.orderItems?.map(it => (
                  <div key={it.id} className="flex items-center gap-3">
                    <div>{it.product?.name}</div>
                    <div className="ml-auto">Qty: {it.quantity}</div>
                    <div className="ml-4">Ksh {it.price}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
