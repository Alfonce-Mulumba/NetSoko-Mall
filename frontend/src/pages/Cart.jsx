import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Cart() {
  const [items, setItems] = useState(JSON.parse(localStorage.getItem("cart") || "[]"));

  const remove = (idx) => {
    const next = items.slice();
    next.splice(idx, 1);
    setItems(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  useEffect(() => {
    // update cart count in navbar will reflect since we read localStorage there
  }, [items]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      <div className="grid gap-4">
        <AnimatePresence>
          {items.map((it, i) => (
            <motion.div key={it.productId || i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-4 bg-white rounded shadow flex justify-between items-center">
              <div>
                <div className="font-semibold">{it.name}</div>
                <div className="text-sm text-gray-500">${it.price} × {it.quantity}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => remove(i)} className="px-3 py-1 bg-red-500 text-white rounded">Remove</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {items.length === 0 && <p>Your cart is empty.</p>}
      </div>
    </div>
  );
}
