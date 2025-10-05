import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const hasDiscount = Number(product.discount) > 0;
  const discountedPrice = hasDiscount
    ? Math.round(product.price - (product.price * product.discount) / 100)
    : product.price;

  const isHot =
    product.isHot === true ||
    product.hot === true ||
    product.trending === true;

  return (
    <Link
      to={`/products/${product.id}`}
      className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg 
                 hover:scale-[1.03] transition-transform duration-200 ease-in-out 
                 flex flex-col items-center justify-between p-3 w-[160px] flex-shrink-0"
    >
      {/* 🔥 Hot Label */}
      {isHot && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
          HOT
        </span>
      )}

      {/* 🏷️ Discount Badge */}
      {hasDiscount && (
        <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
          -{product.discount}%
        </span>
      )}

      {/* 🖼️ Product Image */}
      <div className="w-full h-32 flex items-center justify-center mb-2">
        <img
          src={
            product.images?.[0]?.url ||
            product.images?.[0] ||
            product.image ||
            "/placeholder.png"
          }
          alt={product.name || "Product"}
          className="max-h-28 max-w-full object-contain rounded"
          onError={(e) => (e.target.src = "/placeholder.png")}
        />
      </div>

      {/* 📝 Product Info */}
      <div className="text-center space-y-1 w-full">
        <h3 className="font-semibold text-sm truncate text-gray-800 dark:text-gray-100">
          {product.name}
        </h3>

        {product.description && product.description.trim() !== "" && (
          <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
            {product.description}
          </p>
        )}

        {/* 💰 Price Section */}
        <div className="flex items-center justify-center gap-2">
          <span className="font-bold text-primary dark:text-accent text-sm">
            Ksh {discountedPrice?.toLocaleString?.() ?? product.price?.toLocaleString?.()}
          </span>

          {hasDiscount && (
            <span className="text-red-500 line-through text-xs">
              Ksh {product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
