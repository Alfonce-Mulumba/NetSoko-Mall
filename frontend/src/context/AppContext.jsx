import React, { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

const initialCart = { items: [] };
const initialUser = null;

export function AppProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("webwave_cart");
      return raw ? JSON.parse(raw) : initialCart;
    } catch {
      return initialCart;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("webwave_user");
      return raw ? JSON.parse(raw) : initialUser;
    } catch {
      return initialUser;
    }
  });

  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem("webwave_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("webwave_user", JSON.stringify(user));
  }, [user]);

  function addToCart(product, qty = 1) {
    setCart(prev => {
      const found = prev.items.find(i => i.product.id === product.id);
      if (found) {
        return {
          ...prev,
          items: prev.items.map(i => i.product.id === product.id ? { ...i, qty: i.qty + qty } : i)
        };
      }
      return { ...prev, items: [...prev.items, { product, qty }] };
    });
    setToast({ title: "Added", message: `${product.title} added to cart.` });
    setTimeout(() => setToast(null), 2500);
  }

  function updateQty(productId, qty) {
    setCart(prev => ({
      ...prev,
      items: prev.items.map(i => i.product.id === productId ? { ...i, qty } : i)
    }));
  }

  function removeFromCart(productId) {
    setCart(prev => ({ ...prev, items: prev.items.filter(i => i.product.id !== productId) }));
  }

  function clearCart() {
    setCart(initialCart);
  }

  function login(userObj, token) {
    setUser({ ...userObj, token });
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("webwave_user");
  }

  function setToastMessage(t) {
    setToast(t);
    if (t) setTimeout(() => setToast(null), 3500);
  }

  function clearToast() {
    setToast(null);
  }

  return (
    <AppContext.Provider value={{
      cart, addToCart, updateQty, removeFromCart, clearCart,
      user, login, logout,
      toast, setToastMessage, clearToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
