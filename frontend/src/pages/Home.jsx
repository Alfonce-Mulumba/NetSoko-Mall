import React, { useEffect, useState } from "react";
import api from "../api/index.js";
import { Link } from "react-router-dom";

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
  (async () => {
    try {
      const res = await api.getProducts({ limit: 8, sort: "newest" });
      setFeatured(res.data || []);
    } catch (err) {
      console.error("Home fetch error:", err);
      setFeatured([]);
    }
  })();
}, []);

  return (
    <div>
      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Featured</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map(p => (
            <Link key={p.id} to={`/products/${p.id}`} className="bg-white p-3 rounded card-tilt">
              <img src={p.images?.[0]?.url || `https://via.placeholder.com/300?text=${p.name}`} alt={p.name} className="h-40 w-full object-cover mb-2 rounded" />
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-600">Ksh {p.price}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
