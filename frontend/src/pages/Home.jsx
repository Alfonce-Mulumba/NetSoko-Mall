import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import api from "../services/api";
import Loader from "../components/Loader";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.get("/products")
      .then(res => {
        if (mounted && res?.data) setProducts(res.data.slice(0, 9));
      })
      .catch(() => {
        // fallback dummy
        setProducts([
          { id: "p1", title: "Sample Phone", price: 22000, image: null, brand: "Acme" },
          { id: "p2", title: "Running Shoes", price: 4500, image: null, brand: "Stride" },
          { id: "p3", title: "Laptop", price: 75000, image: null, brand: "ProComp" }
        ]);
      })
      .finally(() => mounted && setLoading(false));
    return () => mounted = false;
  }, []);

  return (
    <div className="space-y-8">
      <section className="grid md:grid-cols-2 gap-6 items-center bg-white p-8 rounded-2xl shadow">
        <div>
          <h1 className="text-4xl font-bold mb-4">Shop great products, fast delivery</h1>
          <p className="text-gray-600 mb-4">Secure payments with M-Pesa & PayPal. Seller dashboard & admin tools ready.</p>
          <a href="/products" className="inline-block px-6 py-3 bg-brand text-white rounded-xl btn-glow">Start Shopping</a>
        </div>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-gray-400">Hero image</div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Featured</h2>
        {loading ? <Loader /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
