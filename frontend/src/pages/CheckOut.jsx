import React, { useState } from "react";
import { motion } from "framer-motion";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const placeOrder = async () => {
    setLoading(true);
    try {
      // Order creation - backend will use cart from DB in your implementation.
      const res = await api.post("/orders");
      alert("Order placed!");
      localStorage.removeItem("cart");
      navigate("/orders");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to place order");
    } finally { setLoading(false); }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
        <div className="bg-white p-6 rounded shadow">
          <p>Review your order and confirm payment (payment integration later).</p>
          <div className="mt-4">
            <button onClick={placeOrder} disabled={loading} className="px-4 py-2 bg-black text-white rounded">
              {loading ? "Processing..." : "Place Order (Checkout)"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
