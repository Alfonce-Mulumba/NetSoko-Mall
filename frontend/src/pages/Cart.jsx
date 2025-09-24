import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Cart() {
  const { cart, updateQty, removeFromCart, clearCart } = useApp();
  const navigate = useNavigate();

  const total = cart.items.reduce((s, i) => s + (i.product.price * i.qty), 0);

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-4">Add items to your cart to see them here.</p>
        <Link to="/products" className="px-4 py-2 bg-brand text-white rounded">Shop now</Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {cart.items.map(i => (
          <div key={i.product.id} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
            <div className="w-28 h-28 bg-gray-100 rounded-lg flex items-center justify-center">{/* image */}</div>
            <div className="flex-1">
              <div className="font-semibold">{i.product.title}</div>
              <div className="text-sm text-gray-600">KES {i.product.price}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(i.product.id, Math.max(1, i.qty - 1))} className="px-3 py-1 border rounded">-</button>
              <div>{i.qty}</div>
              <button onClick={() => updateQty(i.product.id, i.qty + 1)} className="px-3 py-1 border rounded">+</button>
            </div>
            <div className="text-right">
              <div className="font-semibold">KES {(i.product.price * i.qty).toLocaleString()}</div>
              <button onClick={() => removeFromCart(i.product.id)} className="text-sm text-red-500 mt-1">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="font-semibold mb-4">Order Summary</div>
        <div className="flex justify-between mb-2"><span>Subtotal</span><span>KES {total.toLocaleString()}</span></div>
        <div className="flex justify-between mb-4"><span>Shipping</span><span>KES 0</span></div>
        <div className="flex justify-between font-bold text-lg mb-4"><span>Total</span><span>KES {total.toLocaleString()}</span></div>

        <button onClick={() => navigate("/checkout")} className="w-full py-3 bg-brand text-white rounded-lg btn-glow">Proceed to Checkout</button>
        <button onClick={clearCart} className="w-full py-2 mt-3 border rounded">Clear Cart</button>
      </div>
    </div>
  );
}
