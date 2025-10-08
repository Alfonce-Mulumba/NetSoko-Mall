import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/index.js";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const nav = useNavigate();

  // ✅ Fetch public products only
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.getProducts({ limit: 12 });
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Smooth horizontal auto-scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scroll = () => {
      if (container.scrollWidth <= container.clientWidth) return;
      container.scrollBy({ left: 250, behavior: "smooth" });

      // Loop back to start
      if (
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 10
      ) {
        setTimeout(() => {
          container.scrollTo({ left: 0, behavior: "smooth" });
        }, 800);
      }
    };

    const interval = setInterval(scroll, 2500);
    return () => clearInterval(interval);
  }, [products]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition min-h-screen">
      {/* ================= HERO SECTION ================= */}
      <section className="bg-gradient-to-r from-blue-900 to-green-700 text-white py-16 px-6 md:px-16 flex flex-col md:flex-row gap-10 items-center justify-between overflow-hidden">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to <span className="text-yellow-400">NetSoko</span>
          </h1>
          <p className="text-gray-200 mb-6 text-lg">
            Discover trending deals & get up to{" "}
            <span className="text-yellow-300 font-semibold">15% OFF</span> today!
          </p>
          <button
            onClick={() => nav("/products")}
            className="bg-yellow-400 text-black px-6 py-2 font-semibold rounded-lg hover:bg-yellow-300 transition shadow-md"
          >
            Shop Now
          </button>
        </div>

        {/* Auto-scrolling gallery */}
        <div
          ref={scrollRef}
          className="flex flex-nowrap gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700 flex-1 py-4"
        >
          {loading ? (
            <p className="text-gray-300">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-300">No products available</p>
          ) : (
            products.map((p) => {
              const hasDiscount = p.discount && p.discount > 0;
              const discountedPrice = hasDiscount
                ? p.price - (p.price * p.discount) / 100
                : p.price;

              return (
                <div
                  key={p.id}
                  className="w-[120px] bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition flex-shrink-0 relative"
                >
                  {hasDiscount && (
                    <span className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                      -{p.discount}%
                    </span>
                  )}
                  <img
                    src={p.images?.[0]?.url || p.images?.[0] || "/placeholder.png"}
                    alt={p.name}
                    className="w-full h-24 object-cover rounded-t-lg"
                  />
                  <div className="p-2 text-center">
                    <h3 className="font-semibold text-xs text-gray-800 dark:text-gray-100 truncate">
                      {p.name}
                    </h3>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      {hasDiscount && (
                        <span className="line-through text-red-500 mr-1">
                          Ksh {p.price.toLocaleString()}
                        </span>
                      )}
                      <span className="font-bold text-blue-700 dark:text-blue-400">
                        Ksh {discountedPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

{/* ================= FEATURED PRODUCTS ================= */}
<section className="px-6 md:px-16 py-10">
  <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center md:text-left">
    Featured Products
  </h2>

  {loading ? (
    <p className="text-gray-600 dark:text-gray-400 text-center">
      Loading products...
    </p>
  ) : (
    (() => {
      // ✅ define your size preference here: "small", "medium", or "large"
      const size = "small";

      const gridClasses =
        size === "small"
          ? "grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
          : size === "medium"
          ? "grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7"
          : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

      const cardSize = {
        small: { minWidth: "max-w-[300px]", imageHeight: "max-h-30", padding: "p-0", text: "text-xs" },
        medium: { minWidth: "min-w-[180px]", imageHeight: "h-36", padding: "p-3", text: "text-sm" },
        large: { minWidth: "min-w-[220px]", imageHeight: "h-44", padding: "p-4", text: "text-base" },
      }[size];

      return (
        <div className={`grid gap-1 ${gridClasses}`}>
          {products.map((p) => {
            const hasDiscount = p.discount && p.discount > 0;
            const discountedPrice = hasDiscount
              ? p.price - (p.price * p.discount) / 100
              : p.price;

            return (
              <div
                key={p.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all relative group overflow-hidden ${cardSize.minWidth}`}
              >
                {hasDiscount && (
                  <span className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                    -{p.discount}%
                  </span>
                )}

                <img
                  src={p.images?.[0]?.url || p.images?.[0] || "/placeholder.png"}
                  alt={p.name}
                  className={`w-full ${cardSize.imageHeight} object-cover group-hover:scale-105 transition-transform duration-300`}
                />

                <div className={`text-center ${cardSize.padding}`}>
                  <h3
                    className={`font-semibold text-gray-800 dark:text-gray-200 truncate ${cardSize.text}`}
                  >
                    {p.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 mb-1">
                    {p.description}
                  </p>
                  <div className="flex flex-col items-center">
                    {hasDiscount && (
                      <span className="text-[11px] text-red-500 line-through">
                        Ksh {p.price.toLocaleString()}
                      </span>
                    )}
                    <span className="font-bold text-blue-700 dark:text-blue-400 text-xs sm:text-sm">
                      Ksh {discountedPrice.toLocaleString()}
                    </span>
                  </div>
                  <Link
                    to={`/products/${p.id}`}
                    className="text-green-600 dark:text-green-400 text-[11px] mt-2 inline-block hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      );
    })()
  )}
</section>
    </div>
  );
}
