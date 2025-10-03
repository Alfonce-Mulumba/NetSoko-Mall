import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      // ✅ whole card is clickable
      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-lg hover:scale-105 transition-transform duration-200 ease-in-out flex flex-col"
    >
      {/* Product Image */}
      <div className="w-full h-40 flex items-center justify-center bg-gray-50 rounded mb-3">
        <img
          src={product.image || product.images?.[0]?.url || "/placeholder.png"}
          alt={product.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-sm truncate">{product.name}</h3>
        <p className="text-xs text-gray-500 line-clamp-2">
          {product.description?.slice(0, 60)}
        </p>
        <div className="font-bold text-indigo-600 mt-1">
          Ksh {product.price}
        </div>
      </div>
    </Link>
  );
}
