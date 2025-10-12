import React, { useEffect, useState, useContext } from "react";
import api from "../../api/index.js";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import EditProductModal from "../../pages/admin/EditProductModal.jsx";

export default function ManageProducts() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrls, setImageUrls] = useState([]);

  // ✅ new optional fields
  const [isHot, setIsHot] = useState(false);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [stock, setStock] = useState("");

  const [loading, setLoading] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    try {
      if (!user || user.role !== "admin") {
        toast.error("❌ You must be an admin to view products");
        return;
      }
      const r = await api.adminGetProducts();
      setProducts(Array.isArray(r.data) ? r.data : r.data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("❌ Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  // Upload images
  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!data.urls) throw new Error(data.error || "Upload failed");
      setImageUrls((prev) => [...prev, ...data.urls]);
      toast.success("✅ Image uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("❌ Image upload failed");
    }
  };

  // Add product
  const handleAdd = async () => {
    if (!user || user.role !== "admin") {
      toast.error("❌ Only admins can add products");
      return;
    }
    if (!name || !price || !category) {
      toast.warning("⚠️ Name, price, and category are required!");
      return;
    }

    setLoading(true);
    try {
      await api.adminCreateProduct({
        name,
        description,
        price,
        category,
        images: imageUrls,
        // ✅ new optional fields
        isHot,
        size: size || undefined,
        color: color || undefined,
        stock: stock || undefined,
      });
      toast.success("✅ Product added successfully!");
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setImageUrls([]);
      setIsHot(false);
      setSize("");
      setColor("");
      setStock("");
      fetchProducts();
    } catch (err) {
      console.error("Add product failed:", err);
      toast.error("❌ Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!user || user.role !== "admin") {
      toast.error("❌ Only admins can delete products");
      return;
    }
    if (!confirm("Delete this product?")) return;
    try {
      await api.adminDeleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("🗑️ Product deleted");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("❌ Failed to delete product");
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Manage Products
      </h2>

      {/* Add product form */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="border p-2 w-full mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="border p-2 w-full mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          type="number"
          className="border p-2 w-full mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="border p-2 w-full mb-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />

        {/* ✅ New Optional Fields */}
        <div className="grid md:grid-cols-2 gap-2 mb-3">
          <input
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="Size (optional)"
            className="border p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <input
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="Colour (optional)"
            className="border p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-2 mb-3">
          <input
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Stock quantity (optional)"
            type="number"
            className="border p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <label className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <input
              type="checkbox"
              checked={isHot}
              onChange={(e) => setIsHot(e.target.checked)}
              className="w-4 h-4"
            />
            Hot Product (🔥 Trending)
          </label>
        </div>

        <input type="file" multiple onChange={handleUpload} className="mb-2" />
        <div className="flex gap-2 mb-2 flex-wrap">
          {imageUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt="preview"
              className="w-20 h-20 object-cover rounded border"
            />
          ))}
        </div>
        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </div>

      {/* List existing products */}
      <div className="grid gap-3">
        {products.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 italic">
            No products. Add one above 👆
          </div>
        ) : (
          products.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-gray-800 p-3 rounded flex items-center gap-3 shadow"
            >
              <img
                src={p.images?.[0]?.url || p.images?.[0] || "/placeholder.png"}
                alt={p.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {p.name}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Ksh {p.price}
                </div>
                {/* ✅ Display optional fields if exist */}
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {p.size && <>Size: {p.size} · </>}
                  {p.color && <>Color: {p.color} · </>}
                  {p.stock && <>Stock: {p.stock}</>}
                  {p.isHot && (
                    <span className="ml-1 text-red-500 font-semibold">🔥 Hot</span>
                  )}
                </div>
              </div>
              <div className="ml-auto flex gap-4">
                <button
                  className="text-blue-600 dark:text-blue-400"
                  onClick={() => setEditingProduct(p)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 dark:text-red-400"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✅ Modal for editing */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdated={fetchProducts}
        />
      )}
    </div>
  );
}
