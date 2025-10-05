import React from "react";
import logoBlack from "../assets/logoBlack.jpg";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition px-6 md:px-16 py-10">
      <div className="max-w-3xl mx-auto text-center">
        <img
          src={logoBlack}
          alt="NetSoko"
          className="w-20 h-20 rounded-full mx-auto mb-4 shadow"
        />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          About NetSoko
        </h1>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
          NetSoko is your trusted online marketplace designed to make shopping
          smarter, faster, and better. From the latest tech to daily essentials,
          we bring quality products to your fingertips with unmatched convenience.
        </p>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Our mission is to empower buyers and sellers across Kenya and beyond by
          providing a reliable, easy-to-use platform with real-time assistance,
          seamless payments, and timely deliveries.
        </p>
      </div>
    </div>
  );
}
