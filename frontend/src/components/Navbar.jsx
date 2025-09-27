// frontend/src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bars3Icon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import LoginModal from "./auth/LoginModal";
import RegisterModal from "./auth/RegisterModal";

export default function Navbar() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const navigate = useNavigate();

  // ✅ safe cart parsing
  const cartRaw = localStorage.getItem("cart");
  const cartCount = cartRaw && cartRaw !== "undefined" ? JSON.parse(cartRaw).length : 0;

  // ✅ safe user parsing
  const userRaw = localStorage.getItem("user");
  const user = userRaw && userRaw !== "undefined" ? JSON.parse(userRaw) : null;

  const logout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button className="p-2">
            <Bars3Icon className="w-6 h-6" />
          </button>
          <Link to="/" className="text-2xl font-bold">NetSoko</Link>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/products" className="hover:underline">Shop</Link>

          {user?.role === "admin" && (
            <Link to="/admin" className="text-sm bg-gray-900 text-white px-3 py-1 rounded">Admin</Link>
          )}

          {user ? (
            <>
              <span className="text-sm">Hi, {user.name}</span>
              <button onClick={logout} className="text-sm text-red-600">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => setOpenLogin(true)} className="text-sm">Login</button>
              <button onClick={() => setOpenRegister(true)} className="text-sm">Register</button>
            </>
          )}

          <Link to="/cart" className="relative">
            <ShoppingBagIcon className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      <LoginModal open={openLogin} setOpen={setOpenLogin} />
      <RegisterModal open={openRegister} setOpen={setOpenRegister} />
    </>
  );
}
