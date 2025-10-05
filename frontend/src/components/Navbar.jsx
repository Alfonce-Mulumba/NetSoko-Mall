import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingBagIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AuthContext } from "../context/AuthContext.jsx";
import { CartContext } from "../context/CartContext.jsx";
import logoBlack from "../assets/logoBlack.jpg";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { items } = useContext(CartContext);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const nav = useNavigate();
  const location = useLocation();

  const links = [
    { name: "Home", to: "/" },
    { name: "Categories", to: "/categories" },
    { name: "Specials", to: "/specials" },
    { name: "Blog", to: "/blog" },
    { name: "About", to: "/about" },
    { name: "Contact", to: "/contact" },
  ];

  // ✅ Hide only on home page when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const isHome = location.pathname === "/";

      if (!isHome) {
        setVisible(true);
        return;
      }

      if (currentScroll > lastScrollY && currentScroll > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, location.pathname]);

  // ✅ Show when cursor is near top
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientY < 60) setVisible(true);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-500 ${
        visible ? "translate-y-0" : "-translate-y-full"
      } backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-700 shadow-sm`}
    >
      <div className="container mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
        {/* LEFT: Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => nav("/")}
        >
          <img
            src={logoBlack}
            alt="NetSoko"
            className="h-10 w-10 rounded-full object-cover shadow"
          />
          <span className="text-2xl font-bold text-primary dark:text-accent">
            NetSoko
          </span>
        </div>

        {/* CENTER: Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`transition hover:text-primary dark:hover:text-accent ${
                location.pathname === link.to
                  ? "text-primary dark:text-accent font-semibold"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* ✅ Show Admin link for admin users */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={`transition hover:text-primary dark:hover:text-accent ${
                location.pathname.startsWith("/admin")
                  ? "text-primary dark:text-accent font-semibold"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Admin
            </Link>
          )}
        </div>

        {/* RIGHT: Icons */}
        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={() => nav("/profile")}
              className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-accent"
            >
              <UserCircleIcon className="w-6 h-6" />
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm hover:text-primary dark:hover:text-accent"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm hover:text-primary dark:hover:text-accent"
              >
                Register
              </Link>
            </>
          )}

          {/* Cart */}
          <button
            onClick={() => nav("/cart")}
            className="relative text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-accent"
          >
            <ShoppingBagIcon className="w-6 h-6" />
            {items?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </button>

          {user && (
            <button
              onClick={logout}
              className="hidden md:inline text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Logout
            </button>
          )}

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {open ? (
              <XMarkIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-4 px-6 flex flex-col gap-3 text-sm">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`${
                location.pathname === link.to
                  ? "text-primary dark:text-accent font-semibold"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent"
            >
              Admin
            </Link>
          )}

          {user ? (
            <>
              <Link to="/profile" onClick={() => setOpen(false)}>
                Profile
              </Link>
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
