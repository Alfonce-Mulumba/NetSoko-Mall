import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="card">
      <img src={product.image || "/placeholder.png"} alt={product.name} className="w-full h-44 object-cover rounded"/>
      <h3 className="mt-3 font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-600">{product.description?.slice(0,80)}</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="font-bold">${product.price}</div>
        <Link to={`/products/${product.id}`} className="btn btn-primary">View</Link>
      </div>
    </div>
  );
}
