import React, { useEffect, useState } from "react";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  useEffect(()=> {
    api.get("/api/products").then(r=>setProducts(r.data)).catch(()=>{});
  }, []);
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
