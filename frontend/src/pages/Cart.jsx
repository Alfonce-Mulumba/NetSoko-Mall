import React, { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/index.js";

export default function Cart() {
  const { items, remove } = useContext(CartContext);
  const nav = useNavigate();

  const total = items.reduce((s,i)=> s + (i.product?.price || 0) * i.quantity, 0);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {items.length === 0 ? (
        <div>
          <p>Your cart is empty.</p>
          <Link to="/products" className="text-primary">Start shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {items.map(i => (
              <div key={i.id} className="bg-white p-3 rounded mb-3 flex items-center gap-4">
                <img src={i.product?.images?.[0]?.url || `https://via.placeholder.com/100`} className="w-24 h-24 object-cover rounded" />
                <div>
                  <div className="font-semibold">{i.product?.name}</div>
                  <div className="text-sm text-gray-600">Ksh {i.product?.price}</div>
                  <div>Qty: {i.quantity}</div>
                </div>
                <div className="ml-auto">
                  <button className="text-red-600" onClick={() => remove(i.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-4 rounded">
            <div className="font-semibold">Summary</div>
            <div className="mt-2">Total: <span className="font-bold">Ksh {total}</span></div>
            <button onClick={() => nav("/checkout")} className="mt-4 w-full bg-primary text-white p-2 rounded">Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}
