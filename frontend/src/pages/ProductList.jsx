import React, { useEffect, useState } from "react";
import api from "../api/index.js";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx"; // ✅ use updated card

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [price, setPrice] = useState([0, 200000]); // ✅ price filter state
  const [searchParams] = useSearchParams();
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
        res = await api.getProducts({ limit: 24, sort });
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
    <div className="container mx-auto px-6 py-6 flex gap-8">
      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="hidden md:block w-64 bg-white p-4 rounded shadow-sm h-fit">
        {/* Search */}
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Search</h4>
          <input
            defaultValue={q}
            onChange={(e) =>
              window.location.assign(`/products?q=${e.target.value}`)
            }
            placeholder="Search products..."
            className="w-full p-2 border rounded text-sm"
          />
        </div>

        {/* Price Range */}
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Price</h4>
          <input
            type="range"
            min="0"
            max="200000"
            value={price[1]}
            onChange={(e) => setPrice([0, Number(e.target.value)])}
            className="w-full"
          />
          <div className="text-xs text-gray-600">
            Ksh {price[0]} - Ksh {price[1]}
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded text-sm"
          >
            <option value="">All</option>
            <option value="Shoes">Shoes</option>
            <option value="Laptops">Laptops</option>
            <option value="Phones">Mobile Phones</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <h4 className="font-semibold mb-2">Tags</h4>
          <div className="flex flex-wrap gap-2 text-xs">
            {["Bags", "Trackers", "Shoes", "Laptops"].map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 border rounded cursor-pointer hover:bg-gray-100"
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
          <h2 className="text-lg font-semibold">Shop With Category</h2>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="p-2 border rounded text-sm"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
          </select>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
