import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaRegStar, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import api from "../api";
import { CartContext } from "../context/CartContext.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.getProductById(id);
        const data = res.data;
        setProduct(data);
        setSelectedImage(data.images?.[0]?.url || "");
        setSelectedColor(data.colors?.[0] || "");
        setSelectedSize(data.sizes?.[0]?.size || "");
        setReviews(data.reviews || []);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleAddToCart = async (buyNow = false) => {
    if (!product || product.stock <= 0) return alert("Out of stock");
    if (quantity > product.stock)
      return alert(`Only ${product.stock} left in stock`);

    try {
      await add(product.id, quantity, selectedColor, selectedSize);
      if (buyNow) navigate("/checkout");
      else alert("Added to cart!");
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)
      : 0;

  if (loading)
    return (
      <div className="p-10 text-center text-gray-600 dark:text-gray-300">
        Loading...
      </div>
    );
  if (!product)
    return (
      <div className="p-10 text-center text-gray-600 dark:text-gray-300">
        Product not found.
      </div>
    );

  const kshPrice = (product.price * 145).toLocaleString();
  const discountPrice = product.discount
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : null;
  const kshDiscount = discountPrice && (discountPrice * 145).toLocaleString();

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* === PRODUCT GRID === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        {/* LEFT: IMAGES */}
        <div className="flex flex-col items-center">
          <img
            src={
              selectedImage ||
              product.images?.[0]?.url ||
              `https://via.placeholder.com/500?text=${product.name}`
            }
            alt={product.name}
            className="w-full h-[300px] object-contain rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700"
          />
          {product.images?.length > 1 && (
            <div className="flex justify-center gap-3 mt-4 flex-wrap">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt=""
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-20 h-20 object-cover cursor-pointer border rounded-md transition ${
                    selectedImage === img.url
                      ? "border-gray-900 dark:border-gray-100"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: DETAILS */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              {Array(5)
                .fill(0)
                .map((_, i) =>
                  i < Math.round(avgRating) ? (
                    <FaStar key={i} className="text-yellow-400" />
                  ) : (
                    <FaRegStar key={i} className="text-gray-400 dark:text-gray-500" />
                  )
                )}
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {avgRating} / 5 ({reviews.length} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-4">
              <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                Ksh {kshDiscount || kshPrice}
              </p>
              {kshDiscount && (
                <p className="text-gray-400 line-through text-lg">
                  Ksh {kshPrice}
                </p>
              )}
              {product.discount && (
                <p className="text-green-600 dark:text-green-400 font-medium mt-1">
                  -{product.discount}% off
                </p>
              )}
            </div>

            {/* Stock */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Available Stock:{" "}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {product.stock}
              </span>
            </p>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-4">
                <p className="font-medium text-sm mb-1">Colors:</p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1 rounded-md border transition ${
                        selectedColor === color
                          ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-black"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-4">
                <p className="font-medium text-sm mb-1">Sizes:</p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((s) => (
                    <button
                      key={s.size}
                      onClick={() => setSelectedSize(s.size)}
                      className={`px-3 py-1 rounded-md border transition ${
                        selectedSize === s.size
                          ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-black"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p className="font-medium text-sm mb-1">Quantity:</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                  className="px-3 py-1 border rounded dark:border-gray-600"
                >
                  -
                </button>
                <span className="w-6 text-center">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((q) => (q < product.stock ? q + 1 : q))
                  }
                  className="px-3 py-1 border rounded dark:border-gray-600"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => handleAddToCart(true)}
                disabled={product.stock === 0}
                className={`flex-1 py-3 rounded-md font-semibold transition ${
                  product.stock === 0
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-900 text-white dark:bg-gray-100 dark:text-black hover:opacity-90"
                }`}
              >
                BUY IT NOW
              </button>
              <button
                onClick={() => handleAddToCart(false)}
                disabled={product.stock === 0}
                className={`flex-1 py-3 rounded-md border font-semibold transition ${
                  product.stock === 0
                    ? "border-gray-300 text-gray-400 dark:border-gray-700 cursor-not-allowed"
                    : "border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* === TABS === */}
      <div className="bg-white dark:bg-gray-800 mt-10 rounded-2xl shadow-md p-6 transition">
        <div className="flex gap-6 border-b border-gray-200 dark:border-gray-700">
          {["details", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 capitalize text-sm font-medium transition ${
                activeTab === tab
                  ? "border-b-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "details" && (
          <div className="pt-6 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>{product.description}</p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-semibold">{avgRating}</span>
              <FaStar className="text-yellow-400" />
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                ({reviews.length} reviews)
              </span>
            </div>

            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3 border rounded-md flex flex-col gap-1 border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{rev.user?.name || "User"}</p>
                    <div className="flex gap-1">
                      {Array(5)
                        .fill(0)
                        .map((_, i) =>
                          i < rev.rating ? (
                            <FaStar
                              key={i}
                              className="text-yellow-400 text-sm"
                            />
                          ) : (
                            <FaRegStar
                              key={i}
                              className="text-gray-400 dark:text-gray-600 text-sm"
                            />
                          )
                        )}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {rev.comment}
                  </p>

                  <div className="flex gap-3 mt-1 text-gray-500 dark:text-gray-400 text-xs">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100">
                      <FaThumbsUp /> {rev.likes || 0}
                    </button>
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100">
                      <FaThumbsDown /> {rev.dislikes || 0}
                    </button>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
