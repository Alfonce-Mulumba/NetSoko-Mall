import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, user, clearCart, setToastMessage } = useApp();
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState(user?.phone || "");
  const [name, setName] = useState(user?.name || "");
  const navigate = useNavigate();

  const total = cart.items.reduce((s, i) => s + (i.product.price * i.qty), 0);

  async function handleMpesa() {
    setLoading(true);
    try {
      // call backend to initiate STK Push
      await api.post("/payments/mpesa", {
        phone,
        amount: total,
        items: cart.items
      });
      setToastMessage({ title: "STK Sent", message: "Check your phone to complete the payment." });
      // backend webhook will confirm; for now simulate success by navigating to orders:
      clearCart();
      navigate("/orders");
    } catch (err) {
      setToastMessage({ title: "Payment failed", message: err?.response?.data?.message || "Could not initiate payment." });
    } finally {
      setLoading(false);
    }
  }

  async function handlePayPal() {
    setLoading(true);
    try {
      const res = await api.post("/payments/paypal/create", { amount: total, items: cart.items });
      // expected to return approvalUrl or orderID
      if (res?.data?.approvalUrl) {
        window.location.href = res.data.approvalUrl; // redirect to PayPal
      } else {
        setToastMessage({ title: "PayPal", message: "PayPal flow started." });
      }
    } catch (err) {
      setToastMessage({ title: "PayPal Error", message: "Could not start PayPal payment." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Shipping details</h2>
        <div className="space-y-3">
          <input className="w-full border p-3 rounded" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full border p-3 rounded" placeholder="Phone (e.g. 2547...)" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input className="w-full border p-3 rounded" placeholder="Address" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Order summary</h2>
        <div className="space-y-2">
          {cart.items.map(i => (
            <div key={i.product.id} className="flex justify-between">
              <div className="text-sm text-gray-600">{i.product.title} x{i.qty}</div>
              <div className="text-sm font-semibold">KES {(i.product.price * i.qty).toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="flex justify-between font-bold text-lg">
            <div>Total</div>
            <div>KES {total.toLocaleString()}</div>
          </div>

          <button onClick={handleMpesa} disabled={loading} className="mt-4 w-full py-3 bg-brand text-white rounded-lg btn-glow">
            {loading ? "Processing..." : "Pay with M-Pesa"}
          </button>

          <button onClick={handlePayPal} disabled={loading} className="mt-3 w-full py-3 border rounded-lg">
            Pay with PayPal
          </button>
        </div>
      </div>
    </div>
  );
}
