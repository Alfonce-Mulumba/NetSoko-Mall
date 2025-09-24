import React from "react";

export default function ProductCard({title='Product', price=0}){
  return (
    <div className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-1">
      <div className="h-40 bg-gray-100 rounded-md mb-4 flex items-center justify-center">Image</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-green-600 font-bold">KES {price}</p>
      <button className="mt-3 px-4 py-2 rounded bg-green-600 text-white">Add to cart</button>
    </div>
  );
}
