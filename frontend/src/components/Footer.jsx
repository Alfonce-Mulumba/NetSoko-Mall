import React from "react";
import logoBlack from "../assets/logoBlack.jpg";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-12 transition">
      {/* TOP SECTIONS */}
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-600 dark:text-gray-400">
        
        {/* Brand + Newsletter */}
        <div>
          <img src={logoBlack} alt="NetSoko" className="h-10 w-10 rounded-full mb-3" />
          <p className="mb-3 text-gray-500 dark:text-gray-400">
            Your trusted online marketplace. Buy smarter, live better.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center border border-gray-300 dark:border-gray-600 rounded overflow-hidden"
          >
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-2 py-1 outline-none text-xs bg-transparent dark:placeholder-gray-500"
            />
            <button className="bg-primary dark:bg-accent text-white px-3 py-1 text-xs">
              Subscribe
            </button>
          </form>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-primary dark:hover:text-accent">About Us</a></li>
            <li><a href="#" className="hover:text-primary dark:hover:text-accent">Contact</a></li>
            <li><a href="#" className="hover:text-primary dark:hover:text-accent">FAQ</a></li>
            <li><a href="#" className="hover:text-primary dark:hover:text-accent">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Categories</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-primary dark:hover:text-accent">Phones</a></li>
            <li><a href="#" className="hover:text-primary dark:hover:text-accent">Laptops</a></li>
            <li><a href="#" className="hover:text-primary dark:hover:text-accent">Shoes</a></li>
            <li><a href="#" className="hover:text-primary dark:hover:text-accent">Accessories</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Contact Us</h4>
          <p>Nairobi, KE</p>
          <p>Email: netsoko.care@gmail.com</p>
          <p>Phone: +254 701 156 348</p>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-200 dark:border-gray-700 py-4 text-center text-xs text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} NetSoko. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-4 text-gray-400 dark:text-gray-500 text-lg">
          <i className="fa-brands fa-cc-visa"></i>
          <i className="fa-brands fa-cc-mastercard"></i>
          <i className="fa-brands fa-cc-paypal"></i>
        </div>
      </div>
    </footer>
  );
}
