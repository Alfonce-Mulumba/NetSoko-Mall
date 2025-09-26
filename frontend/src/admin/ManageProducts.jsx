import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get("/api/products");
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-green-600">Manage Products</h2>
      <button className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">
        + Add Product
      </button>
      <table className="min-w-full border">
        <thead className="bg-green-100">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b">
              <td className="px-4 py-2">{p.name}</td>
              <td className="px-4 py-2">KES {p.price}</td>
              <td className="px-4 py-2">
                <button className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded">
                  Edit
                </button>
                <button className="px-3 py-1 bg-red-600 text-white rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProducts;
