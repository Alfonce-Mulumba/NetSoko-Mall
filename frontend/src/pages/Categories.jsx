import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/index.js";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.getProducts();
        const cats = [...new Set(res.data.map((p) => p.category))];
        setCategories(cats);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition p-6 md:p-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        Shop by Category
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.length ? (
          categories.map((cat, i) => (
            <Link
              key={i}
              to={`/products?category=${encodeURIComponent(cat)}`}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center justify-center text-center"
            >
              <div className="w-20 h-20 bg-yellow-300 dark:bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-lg mb-3">
                {cat[0].toUpperCase()}
              </div>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 capitalize">
                {cat}
              </p>
            </Link>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400">Loading categories...</p>
        )}
      </div>
    </div>
  );
}
