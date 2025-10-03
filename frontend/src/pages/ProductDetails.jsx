import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/index.js";
import { CartContext } from "../context/CartContext.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const { add } = useContext(CartContext);

  useEffect(() => {
    (async () => {
      const res = await api.getProductById(id);
      setProduct(res.data);
      if (res.data.images && res.data.images.length > 0) {
        setSelectedImage(res.data.images[0].url); // set first image as default
      }
    })();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Left side - Gallery */}
      <div className="flex flex-col items-center">
        {/* Main Image */}
        <img
          src={
            selectedImage ||
            product.images?.[0]?.url ||
            `https://via.placeholder.com/500?text=${product.name}`
          }
          alt={product.name}
          className="w-full h-96 object-contain rounded shadow"
        />

        {/* Thumbnails */}
        <div className="flex gap-2 mt-4 flex-wrap justify-center">
          {product.images?.map((img, i) => (
            <img
              key={i}
              src={img.url}
              alt={`thumb-${i}`}
              className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                selectedImage === img.url
                  ? "border-indigo-500 ring-2 ring-indigo-400"
                  : "border-gray-300"
              }`}
              onClick={() => setSelectedImage(img.url)}
            />
          ))}
        </div>
      </div>

      {/* Right side - Details */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-bold">{product.name}</h2>
        <div className="text-primary text-xl mt-2">Ksh {product.price}</div>
        <p className="mt-3 text-gray-700">{product.description}</p>

        <div className="mt-4 flex items-center gap-2">
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-20 p-2 border rounded"
          />
          <button
            className="ml-2 bg-primary text-white px-4 py-2 rounded"
            onClick={() => add(product.id, qty)}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
