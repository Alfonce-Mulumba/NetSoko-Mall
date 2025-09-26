import React, { useState, useEffect } from "react";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await axios.get("/api/cart");
        setCartItems(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCart();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-green-600">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Cart is empty</p>
      ) : (
        <ul className="space-y-4">
          {cartItems.map((item) => (
            <li
              key={item.product._id}
              className="flex justify-between items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              <span>{item.product.name}</span>
              <span className="font-semibold text-green-700">
                {item.qty} x KES {item.product.price}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
