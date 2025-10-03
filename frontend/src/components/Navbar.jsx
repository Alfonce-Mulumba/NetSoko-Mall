import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bars3Icon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../context/AuthContext.jsx";
import { CartContext } from "../context/CartContext.jsx";
import logoBlack from "../assets/logoBlack.jpg"; // ✅ use black logo

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { items } = useContext(CartContext);
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <button className="p-2 md:hidden" onClick={() => setOpen(!open)}>
            <Bars3Icon className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logoBlack}
              alt="NetSoko"
              className="h-8 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Middle: Nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/products" className="hover:text-primary transition">
            Shop
          </Link>
          {user?.role === "admin" && (
            <Link to="/admin" className="hover:text-primary transition">
              Admin
            </Link>
          )}
          {user ? (
            <>
              <span className="text-gray-600">Hi, {user.name}</span>
              <Link
                to="/orders"
                className="hover:text-primary transition"
              >
                My Orders
              </Link>
              <button
                className="text-red-600 hover:underline"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-primary transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-primary transition">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Right: Cart + Search */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingBagIcon className="w-6 h-6 text-gray-700" />
            {items?.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Small screen menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-3 flex flex-col gap-2 text-sm">
          <Link to="/products" onClick={() => setOpen(false)}>
            Shop
          </Link>
          {user?.role === "admin" && (
            <Link to="/admin" onClick={() => setOpen(false)}>
              Admin
            </Link>
          )}
          {user ? (
            <>
              <Link to="/orders" onClick={() => setOpen(false)}>
                My Orders
              </Link>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
