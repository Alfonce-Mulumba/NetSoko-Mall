import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Loader />;

  return (
    <div className="p-8">
      {product && (
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-80 h-80 object-cover rounded-lg shadow-lg hover:scale-105 transition"
          />
          <div>
            <h2 className="text-3xl font-bold text-green-600 mb-3">
              {product.name}
            </h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-xl font-semibold text-green-700 mb-4">
              KES {product.price}
            </p>
            <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg transition">
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
