import React, { useEffect, useState } from "react";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/admin/products", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProducts(data);
  };

  const deleteProduct = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/admin/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts(); // refresh list
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>🛒 Manage Products</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul>
          {products.map((p) => (
            <li key={p.id}>
              {p.name} - ${p.price}
              <button onClick={() => deleteProduct(p.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageProducts;
