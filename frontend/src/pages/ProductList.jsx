import React, { useEffect, useState } from "react";
import api from "../api/index.js";
import { Link } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");

  const fetch = async () => {
    const res = await api.searchProducts({ name: q, category, sort, limit: 24 });
    setProducts(res.data);
  };

  useEffect(() => { fetch(); }, [q, category, sort]);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products..." className="flex-1 p-2 rounded border" />
        <select value={category} onChange={e => setCategory(e.target.value)} className="p-2 border rounded">
          <option value="">All</option>
          <option value="Shoes">Shoes</option>
          <option value="Laptops">Laptops</option>
          <option value="Phones">Mobile Phones</option>
        </select>
        <select value={sort} onChange={e=>setSort(e.target.value)} className="p-2 border rounded">
          <option value="newest">Newest</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map(p => (
          <Link key={p.id} to={`/products/${p.id}`} className="bg-white p-3 rounded card-tilt">
            <img src={p.images?.[0]?.url || `https://placehold.com/300?text=${p.name}`} alt={p.name} className="h-40 object-cover w-full rounded mb-2" />
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-gray-600">Ksh {p.price}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
