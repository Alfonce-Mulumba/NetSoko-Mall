import React, { createContext, useState, useEffect } from "react";
import api from "../api/index.js";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [syncing, setSyncing] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await api.getCart();
      setItems(res.data);
    } catch (err) {
      // if not logged in or empty, keep local cart
      const local = JSON.parse(localStorage.getItem("cart") || "[]");
      setItems(local);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const add = async (productId, quantity = 1) => {
    setSyncing(true);
    try {
      const res = await api.addToCart({ productId, quantity });
      await fetchCart();
      setSyncing(false);
      return res.data;
    } catch (err) {
      setSyncing(false);
      throw err;
    }
  };

  const remove = async (id) => {
    await api.removeFromCart(id);
    await fetchCart();
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
