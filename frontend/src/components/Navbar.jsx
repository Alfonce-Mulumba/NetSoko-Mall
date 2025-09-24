import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const { cart, user, logout } = useApp();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow sticky top-0 z-40">
      <div className="app-container flex items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold text-brand">WebWave Mall</Link>
          <Link to="/products" className="text-sm text-gray-600 hover:text-black">Products</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 7h12l-2-7M10 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            {cart.items.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-brand text-white rounded-full px-2 text-xs">{cart.items.length}</span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <button className="text-sm text-gray-700" onClick={() => navigate("/profile")}>Hi, {user.name.split(" ")[0]}</button>
              <button className="text-sm text-red-500" onClick={() => { logout(); navigate("/"); }}>Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-gray-700">Login</Link>
              <Link to="/register" className="text-sm text-brand font-medium">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
