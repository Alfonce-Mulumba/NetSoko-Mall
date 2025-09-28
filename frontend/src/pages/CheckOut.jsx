import React, { useEffect, useState } from "react";
import api from "../api/index.js";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  const nav = useNavigate();

  useEffect(()=> {
    (async ()=> {
      const res = await api.getAddresses();
      setAddresses(res.data);
      if (res.data.length) setSelected(res.data[0].id);
    })();
  },[]);

  const placeOrder = async () => {
    if (!selected) return alert("Select address");
    try {
      const res = await api.placeOrder({ deliveryAddressId: selected });
      localStorage.setItem("app:toast", JSON.stringify({ title: "Order placed", body: `Order #${res.data.order.id}` }));
      nav("/orders");
    } catch (err) {
      alert(err?.response?.data?.message || "Error placing order");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <div className="bg-white p-4 rounded">
        <div className="mb-2">Choose delivery address</div>
        {addresses.map(a => (
          <label key={a.id} className="block p-2 border rounded mb-2">
            <input type="radio" name="addr" checked={selected===a.id} onChange={() => setSelected(a.id)} />{" "}
            <span className="font-semibold">{a.label}</span> — {a.address}, {a.city}
          </label>
        ))}
        <div className="mt-4">
          <button onClick={placeOrder} className="bg-primary text-white px-4 py-2 rounded">Place Order</button>
        </div>
      </div>
    </div>
  );
}
