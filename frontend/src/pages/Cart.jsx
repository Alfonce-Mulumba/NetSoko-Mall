// frontend/src/pages/Cart.jsx
import React, { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { Link, useNavigate } from "react-router-dom";

/*
  NOTE:
  - This file adds a robust image resolver + onError fallback so broken images
    don't show the broken icon.
  - If you have a local placeholder image in /src/assets/, replace PLACEHOLDER_URL
    with `import placeholder from "../assets/placeholder.png";` and use that value.
*/
const PLACEHOLDER_URL = "https://via.placeholder.com/150?text=No+Image";

function sanitizeUrl(url) {
  if (!url) return null;
  try {
    // remove surrounding quotes if any and trim whitespace
    let s = String(url).trim().replace(/^["']|["']$/g, "");
    // encodeURI so spaces and special chars don't break request
    s = encodeURI(s);
    return s;
  } catch (err) {
    console.warn("sanitizeUrl error:", err, url);
    return url;
  }
}

function getImageSrcFromProduct(product) {
  // candidate sources in order of preference
  // we check many shapes because cart snapshots sometimes differ
  const candidates = [];

  if (!product) return PLACEHOLDER_URL;

  // common fields
  candidates.push(product.image); // single image field
  // product.images might be array of objects like [{url: '...'}]
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    const first = product.images[0];
    // support either object { url: '...' } or string '...'
    candidates.push(first?.url ?? first);
  }
  // some payloads may have different properties
  candidates.push(product.thumbnail, product.img, product.picture);

  // sanitize and return first usable
  for (const c of candidates) {
    if (!c) continue;
    const s = sanitizeUrl(c);
    if (s) return s;
  }

  return PLACEHOLDER_URL;
}

export default function Cart() {
  const { items, remove } = useContext(CartContext);
  const nav = useNavigate();

  const total = items.reduce(
    (s, i) => s + (i.product?.price || 0) * i.quantity,
    0
  );

  return (
    <div className="container mx-auto px-6 py-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Your Cart
      </h2>

      {items.length === 0 ? (
        <div className="text-gray-600 dark:text-gray-400">
          <p>Your cart is empty.</p>
          <Link to="/products" className="text-primary dark:text-accent">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* ================== CART ITEMS ================== */}
          <div className="md:col-span-2 space-y-4">
            {items.map((i) => {
              const imgSrc = getImageSrcFromProduct(i.product);

              return (
                <div
                  key={i.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm 
                           flex items-center gap-4"
                >
                  {/* 
                    - crossOrigin="anonymous" helps if the remote host supports CORS and you need to fetch with credentials disabled.
                    - onError fallback will replace failed images with placeholder and log original URL + product for debugging.
                  */}
                  <img
                    src={imgSrc}
                    alt={i.product?.name || "Product"}
                    className="w-20 h-20 object-contain rounded bg-gray-100 dark:bg-gray-700"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      // Prevent infinite loop if placeholder fails
                      e.target.onerror = null;
                      console.warn("Product image failed to load, falling back. src:", e.target.src, "product:", i.product);
                      e.target.src = PLACEHOLDER_URL;
                    }}
                  />

                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 dark:text-gray-100">
                      {i.product?.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Ksh {i.product?.price}
                    </div>
                    <div className="text-sm">Qty: {i.quantity}</div>
                  </div>

                  <div className="ml-auto">
                    <button
                      className="text-red-600 dark:text-red-400 hover:underline"
                      onClick={() => remove(i.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================== SUMMARY ================== */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md h-fit">
            <div className="font-semibold text-gray-800 dark:text-gray-100">
              Summary
            </div>
            <div className="mt-2 text-gray-700 dark:text-gray-300">
              Total:{" "}
              <span className="font-bold text-gray-900 dark:text-gray-100">
                Ksh {total}
              </span>
            </div>
            <button
              onClick={() => nav("/checkout")}
              className="mt-4 w-full bg-primary dark:bg-accent text-white p-2 rounded hover:opacity-90 transition"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
