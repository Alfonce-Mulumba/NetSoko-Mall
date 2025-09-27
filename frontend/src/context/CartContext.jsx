import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem("cart") || "[]"));

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const add = (product, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex(i => i.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].quantity += qty;
        return copy;
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const remove = (productId) => setItems(prev => prev.filter(i => i.id !== productId));
  const clear = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, add, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
};
