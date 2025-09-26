import React from "react";

const Checkout = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-green-600">Checkout</h2>
      <form className="space-y-4 max-w-lg">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
        />
        <input
          type="text"
          placeholder="Address"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default Checkout;
