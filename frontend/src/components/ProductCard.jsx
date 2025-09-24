import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  return (
    <motion.div whileHover={{ y: -6 }} className="bg-white rounded-2xl shadow p-4">
      <Link to={`/products/${product.id}`}>
        <div className="h-48 w-full rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.title} className="object-cover w-full h-full" />
          ) : (
            <div className="text-gray-400">No image</div>
          )}
        </div>
      </Link>
      <div className="mt-3">
        <Link to={`/products/${product.id}`} className="font-semibold block">{product.title}</Link>
        <p className="text-sm text-gray-500">{product.brand || ""}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="text-lg font-bold text-brand">KES {product.price?.toLocaleString?.() ?? product.price}</div>
          <button className="px-3 py-1 rounded-lg bg-brand text-white btn-glow">Add</button>
        </div>
      </div>
    </motion.div>
  );
}
