import React from "react";
import ProductCard from "./components/ProductCard";

export default function App(){
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">WebWave Mall — Starter</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProductCard title="Sample product" price={999} />
      </div>
    </div>
  );
}
