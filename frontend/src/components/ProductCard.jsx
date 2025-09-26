import React from "react";

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition-transform transform hover:scale-105">
      <img
        src={product.image || "/placeholder.png"}
        alt={product.name}
        className="w-full h-40 object-cover rounded-md"
      />
      <h3 className="mt-2 font-semibold text-lg">{product.name}</h3>
      <p className="text-gray-500">{product.description}</p>
      <p className="text-primary font-bold mt-1">${product.price}</p>
      <button
        onClick={() => onAddToCart(product)}
        className="bg-primary text-white mt-3 w-full py-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
