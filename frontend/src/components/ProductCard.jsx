import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg 
                 hover:scale-105 transition-transform duration-200 ease-in-out 
                 flex flex-col items-center justify-between p-3 aspect-square"
    >
      {/* Product Image */}
      <div className="w-full flex-1 flex items-center justify-center">
        <img
          src={product.image || product.images?.[0]?.url || "/placeholder.png"}
          alt={product.name}
          className="max-h-24 max-w-full object-contain"
        />
      </div>

      {/* Product Info */}
      <div className="mt-2 text-center space-y-1">
        <h3 className="font-medium text-xs truncate text-gray-800 dark:text-gray-200">
          {product.name}
        </h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
          {product.description?.slice(0, 30)}
        </p>
        <div className="font-semibold text-sm text-indigo-600 dark:text-indigo-400">
          Ksh {product.price}
        </div>
      </div>
    </Link>
  );
}
