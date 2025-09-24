import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import api from "../services/api";
import Loader from "../components/Loader";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.get("/products")
      .then(res => {
        if (mounted && res?.data) setProducts(res.data);
      })
      .catch(() => {
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
    <div>
      <h1 className="text-2xl font-semibold mb-6">All Products</h1>
      {loading ? <Loader /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
