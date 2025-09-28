import React, { useEffect, useState } from "react";
import api from "../../api/index.js";

export default function ManageOrders(){
  const [orders, setOrders] = useState([]);
  useEffect(()=>{ (async ()=>{ const r=await api.adminGetOrders(); setOrders(r.data); })(); },[]);
  const update=async (id)=>{ const newStatus = prompt("New status (paid/shipped/completed/cancelled)"); if(!newStatus) return; await api.adminUpdateOrder(id, { status: newStatus }); setOrders(orders.map(o=> o.id===id? {...o, status:newStatus}: o)); };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>
      <div className="space-y-2">
        {orders.map(o=>(
          <div key={o.id} className="bg-white p-3 rounded">
            <div className="flex justify-between"><div>Order #{o.id}</div><div>{o.status}</div></div>
            <div className="mt-2">User: {o.user?.email}</div>
            <div className="mt-2"><button onClick={()=>update(o.id)} className="text-blue-600">Update</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
