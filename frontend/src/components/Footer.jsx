import React from "react";
import logoBlack from "../assets/logoBlack.jpg"; // ✅ add logo

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      {/* ================= TOP SECTIONS ================= */}
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-600">
        
        {/* Brand + Newsletter */}
        <div>
          <img src={logoBlack} alt="NetSoko" className="h-8 mb-3" />
          <p className="mb-3 text-gray-500">
            Your trusted online marketplace. Buy smarter, live better.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center border rounded overflow-hidden"
          >
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-2 py-1 outline-none text-xs"
            />
            <button className="bg-primary text-white px-3 py-1 text-xs">
              Subscribe
            </button>
          </form>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-800">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-primary">About Us</a></li>
            <li><a href="#" className="hover:text-primary">Contact</a></li>
            <li><a href="#" className="hover:text-primary">FAQ</a></li>
            <li><a href="#" className="hover:text-primary">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-800">Categories</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-primary">Phones</a></li>
            <li><a href="#" className="hover:text-primary">Laptops</a></li>
            <li><a href="#" className="hover:text-primary">Shoes</a></li>
            <li><a href="#" className="hover:text-primary">Accessories</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-800">Contact Us</h4>
          <p className="text-gray-500">Nairobi, KE</p>
          <p className="text-gray-500">Email: netsoko.care@gmail.com</p>
          <p className="text-gray-500">Phone: +254 701 156 348</p>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="border-t py-4 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} NetSoko. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-4 text-gray-400 text-lg">
          {/* placeholders for social/payment icons */}
          <i className="fa-brands fa-cc-visa"></i>
          <i className="fa-brands fa-cc-mastercard"></i>
          <i className="fa-brands fa-cc-paypal"></i>
        </div>
      </div>
    </footer>
  );
}
