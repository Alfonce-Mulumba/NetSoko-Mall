import React, { useEffect, useState } from "react";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  useEffect(()=> {
    api.get("/api/products?limit=8").then(r=>setFeatured(r.data)).catch(()=>{});
  }, []);
  return (
    <div>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-8">
        <div>
          <h1 className="hero-title">Discover top products</h1>
          <p className="mt-4 text-gray-600">Fast shipping • Secure payments • 24/7 support</p>
        </div>
        <div className="flex justify-center">
          <img src="/hero.png" alt="hero" className="w-80 h-60 object-cover rounded-lg"/>
        </div>
      </section>

      <h2 className="text-2xl font-semibold mb-4">Featured</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {featured.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
