import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";
import { useApp } from "../context/AppContext";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useApp();

  useEffect(() => {
    let mounted = true;
    api.get(`/products/${id}`)
      .then(res => { if (mounted) setProduct(res.data); })
      .catch(() => { if (mounted) setProduct({ id, title: `Sample product ${id}`, price: 9999, image: null }); })
      .finally(() => mounted && setLoading(false));
    return () => mounted = false;
  }, [id]);

  if (loading) return <Loader />;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl p-4 shadow">
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          {product.image ? <img src={product.image} alt={product.title} className="object-cover h-full" /> : <div className="text-gray-400">No image</div>}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow">
        <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
        <p className="text-brand font-bold text-xl mb-4">KES {product.price?.toLocaleString?.() ?? product.price}</p>
        <p className="text-gray-600 mb-4">Short description about the product goes here.</p>

        <div className="flex gap-3">
          <button onClick={() => addToCart(product, 1)} className="px-5 py-3 rounded-lg bg-brand text-white btn-glow">Add to cart</button>
        </div>
      </div>
    </div>
  );
}
