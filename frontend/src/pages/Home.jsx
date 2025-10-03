import React, { useEffect, useState } from "react";
import api from "../api/index.js";
import { Link } from "react-router-dom";

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.searchProducts({ hot: true, limit: 8 }); // ✅ fixed "limir"
        setFeatured(res.data.products || []);
      } catch (err) {
        console.error("Home fetch error:", err);
        setFeatured([]);
      }
    })();
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {featured.map((p) => (
        <Link
          key={p.id}
          to={`/products/${p.id}`}
          className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-transform duration-200 ease-in-out flex flex-col"
        >
          <div className="w-full h-40 flex items-center justify-center bg-gray-50 rounded mb-3">
            <img
              src={p.images?.[0]?.url}
              alt={p.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="font-semibold text-sm truncate">{p.name}</div>
          {p.discount ? (
            <div className="text-xs text-red-600">
              <span className="line-through mr-1">Ksh {p.price}</span>
              <span>Ksh {Math.round(p.price * (1 - p.discount / 100))}</span>
            </div>
          ) : (
            <div className="text-xs text-gray-600">Ksh {p.price}</div>
          )}
        </Link>
      ))}
    </div>
  );
}
