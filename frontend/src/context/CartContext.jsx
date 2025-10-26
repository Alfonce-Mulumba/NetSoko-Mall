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

  // ✅ Add to cart
  const add = async (productId, quantity = 1, colorId = null, sizeId = null, price = null) => {
    setSyncing(true);
    try {
      const payload = { productId, quantity, colorId, sizeId, price };
      const res = await api.addToCart(payload);
      await fetchCart();
      return res.data;
    } catch (err) {
      console.error("Add to cart failed:", err);
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  // ✅ Remove item
  const remove = async (id) => {
    try {
      await api.removeFromCart(id);
      await fetchCart();
    } catch (err) {
      console.error("Remove from cart failed:", err);
    }
  };

  // ✅ Update quantity (with stock + min limit)
  const updateQuantity = async (id, newQuantity) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const stock = item.product?.stock || 1;
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > stock) newQuantity = stock;

    try {
      setSyncing(true);
      await api.updateCartItem(id, { quantity: newQuantity });
      await fetchCart();
    } catch (err) {
      console.error("Quantity update failed:", err);
    } finally {
      setSyncing(false);
    }
  };

  const value = {
    items,
    add,
    remove,
    updateQuantity, // ✅ now fully functional
    fetchCart,
    syncing,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
