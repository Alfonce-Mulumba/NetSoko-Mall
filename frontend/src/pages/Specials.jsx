import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/index.js";

export default function Specials() {
  const [specials, setSpecials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecials = async () => {
      try {
        const res = await api.getProducts({ discountOnly: true });
        setSpecials(res.data || []);
      } catch (err) {
        console.error("Error fetching specials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecials();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition p-6 md:p-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        Special Offers
      </h1>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-400">Coming soon...</p>
      ) : specials.length ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {specials.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col"
            >
              <img
                src={p.images?.[0]?.url || p.images?.[0] || "/placeholder.png"}
                alt={p.name}
                className="h-40 w-full object-cover rounded mb-3"
              />
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">{p.name}</h3>
              <p className="text-yellow-500 font-bold">Ksh {p.price}</p>
              <Link
                to={`/products/${p.id}`}
                className="text-blue-600 dark:text-yellow-400 text-sm mt-auto hover:underline"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No specials right now.</p>
      )}
    </div>
  );
}
