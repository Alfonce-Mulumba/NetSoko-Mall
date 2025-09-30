import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bars3Icon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../context/AuthContext.jsx";
import { CartContext } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { items } = useContext(CartContext);
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button className="p-2 md:hidden"><Bars3Icon className="w-6 h-6" /></button>
          <Link to="/" className="text-2xl font-bold text-primary">NetSoko</Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/products" className="text-sm hover:underline">Shop</Link>
            {user?.role === "admin" && (
          <Link to="/admin" className="text-sm">Admin</Link>)}
          {user ? (
            <>
              <span className="text-sm">Hi, {user.name}</span>
               <Link to="/orders" className="text-sm hover:underline">My Orders</Link>
              <button className="text-sm text-red-600" onClick={() => { logout(); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm">Login</Link>
              <Link to="/register" className="text-sm">Register</Link>
            </>
          )}
          <Link to="/cart" className="relative">
            <ShoppingBagIcon className="w-6 h-6" />
            {items?.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </Link>
          <form
  onSubmit={(e) => {
    e.preventDefault();
    const query = e.target.search.value;
    nav(`/products?q=${encodeURIComponent(query)}`);
  }}
  className="flex items-center border rounded overflow-hidden"
>
  <input
    type="text"
    name="search"
    placeholder="Search products..."
    className="px-2 py-1 text-sm outline-none"
  />
  <button type="submit" className="bg-primary text-white px-3 text-sm">
    Search
  </button>
</form>
        </div>

        {/* small screen */}
        <div className="md:hidden">
          <button className="p-2" onClick={() => setOpen(!open)}>Menu</button>
        </div>
      </div>
    </nav>
  );
}
