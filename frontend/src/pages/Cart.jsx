import React, { useContext, useState, useMemo } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { Link, useNavigate } from "react-router-dom";

const PLACEHOLDER_URL = "https://via.placeholder.com/150?text=No+Image";

export default function Cart() {
  const { items, remove, updateQuantity } = useContext(CartContext);
  const [shippingMode, setShippingMode] = useState("pickup"); // pickup | delivery
  const nav = useNavigate();

  // ✅ Compute subtotal
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = item.product?.price || 0;
      const discount = item.product?.discount || 0;
      const discountedPrice =
        discount > 0 ? price - (price * discount) / 100 : price;
      return sum + discountedPrice * item.quantity;
    }, 0);
  }, [items]);

  const shippingCost = shippingMode === "delivery" ? 500 : 0;
  const total = subtotal + shippingCost;

  return (
    <div className="container mx-auto px-4 md:px-8 py-10">
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">
          My Cart
        </h2>
        <Link
          to="/products"
          className="text-sm px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          ← Continue shopping
        </Link>
      </div>

      {/* ===== EMPTY STATE ===== */}
      {items.length === 0 ? (
        <div className="text-gray-600 dark:text-gray-400">
          <p>Your cart is empty.</p>
          <Link to="/products" className="text-primary dark:text-accent underline">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* ===== CART TABLE ===== */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm md:text-base">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr className="text-gray-600 dark:text-gray-300">
                  <th className="text-left py-4 px-4 md:px-6">PRODUCT</th>
                  <th className="text-left py-4 px-4 md:px-6">PRICE</th>
                  <th className="text-center py-4 px-4 md:px-6">QTY</th>
                  <th className="text-right py-4 px-4 md:px-6">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const p = item.product || {};
                  const price = p.price || 0;
                  const discount = p.discount || 0;
                  const discountedPrice =
                    discount > 0 ? price - (price * discount) / 100 : price;

                  const imageUrl = Array.isArray(p.images)
                    ? (p.images[0]?.url || p.images[0] || PLACEHOLDER_URL)
                    : (p.image || PLACEHOLDER_URL);

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 dark:border-gray-700 last:border-none"
                    >
                      <td className="flex items-center gap-4 py-4 px-4 md:px-6">
                        <img
                          src={imageUrl}
                          alt={p.name}
                          className="w-16 h-16 object-contain rounded bg-gray-100 dark:bg-gray-700"
                          onError={(e) => (e.target.src = PLACEHOLDER_URL)}
                        />
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                            {p.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {p.description || "No description"}
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-4 md:px-6 text-gray-700 dark:text-gray-300">
                        {discount > 0 ? (
                          <div>
                            <span className="text-red-500 line-through text-xs block">
                              Ksh {price.toLocaleString()}
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                              Ksh {discountedPrice.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <>Ksh {price.toLocaleString()}</>
                        )}
                      </td>

                      <td className="py-4 px-4 md:px-6 text-center">
                        <div className="inline-flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            −
                          </button>
                          <span className="px-3 text-gray-800 dark:text-gray-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="py-4 px-4 md:px-6 text-right text-gray-900 dark:text-gray-100 font-semibold">
                        Ksh {(discountedPrice * item.quantity).toLocaleString()}
                        <button
                          onClick={() => remove(item.id)}
                          className="ml-3 text-red-500 hover:text-red-700 text-sm"
                          title="Remove"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ===== SHIPPING & SUMMARY ===== */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Shipping Mode */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Choose shipping mode:
              </h4>
              <div className="space-y-3 text-sm">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    value="pickup"
                    checked={shippingMode === "pickup"}
                    onChange={(e) => setShippingMode(e.target.value)}
                  />
                  <div>
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      Store pickup (in 20 min)
                    </span>
                    <span className="text-green-500 ml-2">FREE</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    value="delivery"
                    checked={shippingMode === "delivery"}
                    onChange={(e) => setShippingMode(e.target.value)}
                  />
                  <div>
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      Delivery at home (1–4 days)
                    </span>
                    <span className="text-gray-500 ml-2">Ksh 500</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Ksh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shippingCost ? "text-gray-500" : "text-green-500"}>
                    {shippingCost ? `Ksh ${shippingCost}` : "Free"}
                  </span>
                </div>
                <hr className="my-2 border-gray-300 dark:border-gray-700" />
                <div className="flex justify-between font-bold text-gray-900 dark:text-gray-100 text-lg">
                  <span>Total</span>
                  <span>Ksh {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => nav("/checkout")}
                className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg shadow transition"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
