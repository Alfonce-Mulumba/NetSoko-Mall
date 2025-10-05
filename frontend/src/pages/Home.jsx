import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/index.js";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.adminGetProducts({ limit: 10 });
        console.log("Fetched products:", res.data);
        setProducts(res.data.products ||res.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scroll = () => {
      if (container.scrollWidth <= container.clientWidth) return;
      container.scrollBy({ left: 250, behavior: "smooth" });

      // If reached end, scroll back to start
      if (
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 10
      ) {
        setTimeout(() => {
          container.scrollTo({ left: 0, behavior: "smooth" });
        }, 1000);
      }
    };

    const interval = setInterval(scroll, 2500);
    return () => clearInterval(interval);
  }, [products]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition">
      <section className="bg-black text-white py-16 px-6 md:px-16 flex flex-col gap-8 md:flex-row items-center justify-between overflow-hidden">
        <div className="flex-1">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">NetSoko Home</h1>
          <p className="mb-6 text-gray-300">
            Get Flat <span className="text-yellow-400 font-bold">15% OFF</span> on Order
          </p>
          <button
            onClick={() => nav("/products")}
            className="bg-yellow-400 text-black px-5 py-2 font-semibold rounded hover:bg-yellow-300 transition"
          >
            Shop Now
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex flex-nowrap gap-6 overflow-x-auto scrollbar-hide flex-1 py-4 md:py-0"
        >
          {loading ? (
            <p className="text-gray-400">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-400">No products available</p>
          ) : (
            products.map((p) => (
              <div
                key={p.id}
                className="min-w-[100px] bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition flex-shrink-0"
              >
                <img
                  src={p.images?.[0]?.url || p.images?.[0] || "/placeholder.png"}
                  alt={p.name}
                  className="w-full h-20 object-cover rounded-t-lg"
                />
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                    {p.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Ksh {p.price}
                  </p>
                  <Link
                    to={`/products/${p.id}`}
                    className="text-yellow-600 text-xs mt-2 inline-block hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="px-6 md:px-16 py-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Featured Products
        </h2>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
            {products.map((p) => (
              <div
                key={p.id}
                className="min-w-[200px] bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition flex-shrink-0"
              >
                <img
                  src={p.images?.[0]?.url || p.images?.[0] || "/placeholder.png"}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                    {p.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Ksh {p.price}
                  </p>
                  <Link
                    to={`/products/${p.id}`}
                    className="text-yellow-500 text-xs mt-2 inline-block hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
