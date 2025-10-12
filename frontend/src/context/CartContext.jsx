import React, { createContext, useState, useEffect } from "react";
import api from "../api/index.js";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [syncing, setSyncing] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await api.getCart();
      const normalized = res.data.map((i) => ({
        ...i,
        product: {
          ...i.product,
          image:
            i.product?.image ||
            i.product?.images?.[0]?.url ||
            i.product?.images?.[0] ||
            null,
        },
      }));
      setItems(normalized);
    } catch (err) {
      console.error("Cart fetch failed, falling back to localStorage", err);
      const local = JSON.parse(localStorage.getItem("cart") || "[]");
      setItems(local);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ FIXED add() method to accept the full object structure expected by backend
  const add = async (productId, quantity = 1, colorId = null, sizeId = null) => {
    setSyncing(true);
    try {
      const payload = { productId, quantity, colorId, sizeId };
      const res = await api.addToCart(payload);
      await fetchCart(); // Refresh cart
      return res.data;
    } catch (err) {
      console.error("Add to cart failed:", err);
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.removeFromCart(id);
      await fetchCart();
    } catch (err) {
      console.error("Remove from cart failed:", err);
    }
  };

  const value = {
    items,
    add,
    remove,
    fetchCart,
    syncing,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
