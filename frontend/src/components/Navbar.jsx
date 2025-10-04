import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bars3Icon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../context/AuthContext.jsx";
import { CartContext } from "../context/CartContext.jsx";
import logoBlack from "../assets/logoBlack.jpg";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { items } = useContext(CartContext);
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  return (
    <nav className="backdrop-blur-md bg-white/80 dark:bg-gray-900/80 shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 transition">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <button className="p-2 md:hidden" onClick={() => setOpen(!open)}>
            <Bars3Icon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logoBlack}
              alt="NetSoko"
              className="h-10 w-10 rounded-full object-cover shadow-sm"
            />
            <span className="text-xl font-bold text-primary dark:text-accent">
              NetSoko
            </span>
          </Link>
        </div>

        {/* Middle: Nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/products" className="hover:text-primary dark:hover:text-accent transition">
            Shop
          </Link>
          {user?.role === "admin" && (
            <Link to="/admin" className="hover:text-primary dark:hover:text-accent transition">
              Admin
            </Link>
          )}
          {user ? (
            <>
              <span className="text-gray-600 dark:text-gray-300">Hi, {user.name}</span>
              <Link
                to="/orders"
                className="hover:text-primary dark:hover:text-accent transition"
              >
                My Orders
              </Link>
              <button
                className="text-red-600 dark:text-red-400 hover:underline"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-primary dark:hover:text-accent transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-primary dark:hover:text-accent transition">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Right: Cart */}
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            <ShoppingBagIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            {items?.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex flex-col gap-2 text-sm">
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
                className="text-red-600 dark:text-red-400"
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
