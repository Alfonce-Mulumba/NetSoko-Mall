import React, { useEffect, useState } from "react";
import api from "../api/index.js";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [price, setPrice] = useState([0, 200000]);
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const q = searchParams.get("q") || "";

  const fetch = async () => {
    try {
      let res;
      if (q || category || sort !== "newest" || price) {
        res = await api.searchProducts({
          q,
          category,
          sort,
          minPrice: price[0],
          maxPrice: price[1],
          limit: 24,
        });
        setProducts(res.data.products || []);
      } else {
        res = await api.getProducts({ limit: 50, sort });
        setProducts(res.data || []);
      }
    } catch (err) {
      console.error("Product fetch error:", err);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetch();
  }, [q, category, sort, price]);

  return (
    <div className="container mx-auto px-2 py-4 flex gap-5">
      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="hidden md:block w-64 h-fit">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                        p-4 rounded-lg shadow-sm transition">
          {/* Search */}
          <h3 className="text-gray-800 dark:text-gray-200 font-semibold mb-3">Search</h3>
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-2 mb-3 border border-gray-300 dark:border-gray-600 
                       rounded bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200
                       placeholder-gray-400 dark:placeholder-gray-500"
          />

          {/* Price Range */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Price</h4>
            <input
              type="range"
              min="0"
              max="200000"
              value={price[1]}
              onChange={(e) => setPrice([0, Number(e.target.value)])}
              className="w-full accent-primary"
            />
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Ksh {price[0]} - Ksh {price[1]}
            </div>
          </div>

          {/* Category */}
          <h3 className="text-gray-800 dark:text-gray-200 font-semibold mb-3">Category</h3>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded 
                       bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
          >
            <option value="">All</option>
            <option value="Phones">Phones</option>
            <option value="Laptops">Laptops</option>
            <option value="Shoes">Shoes</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        {/* Tags */}
        <div className="mt-4">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Tags</h4>
          <div className="flex flex-wrap gap-2 text-xs">
            {["Bags", "Trackers", "Shoes", "Laptops"].map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded cursor-pointer 
                           bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 
                           hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </aside>

      {/* ================= RIGHT CONTENT ================= */}
      <main className="flex-1">
        {/* Sorting */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Shop With Category</h2>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded text-sm
                       bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
          </select>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {products.map((p) => {
              const hasDiscount = p.discount && p.discount > 0;
              const discountedPrice = hasDiscount
                ? p.price - (p.price * p.discount) / 100
                : p.price;

              return (
                <div
                  key={p.id}
                  onClick={() => nav(`/products/${p.id}`)}
                  className="cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg 
                             transition-all duration-200 relative overflow-hidden group"
                >
                  {/* Hot Label */}
                  {p.isHot || p.hot ? (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold z-10">
                      HOT
                    </div>
                  ) : null}

                  {/* Discount Label */}
                  {hasDiscount && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-semibold z-10">
                      -{p.discount}%
                    </div>
                  )}

                  {/* Product Image */}
<img
  src={
    Array.isArray(p.images)
      ? (p.images[0]?.url || p.images[0] || "/placeholder.png")
      : (p.image || "/placeholder.png")
  }
  alt={p.name}
  className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
/>


                  {/* Info */}
                  <div className="p-3 text-center">
                    <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">
                      {p.name}
                    </h3>

                    {p.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-1">
                        {p.description}
                      </p>
                    )}

                    {/* Pricing */}
                    <div className="flex flex-col items-center">
                      {hasDiscount && (
                        <span className="text-xs text-red-500 line-through">
                          Ksh {p.price.toLocaleString()}
                        </span>
                      )}
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                        Ksh {discountedPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
