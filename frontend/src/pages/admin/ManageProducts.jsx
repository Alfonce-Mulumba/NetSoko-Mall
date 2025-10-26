import React, { useEffect, useState, useContext } from "react";
import api, { uploadImages } from "../../api/index.js";
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
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isHot, setIsHot] = useState(false);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [stock, setStock] = useState("");

  const fetchProducts = async () => {
    try {
      if (!user || user.role !== "admin") {
        toast.error("❌ You must be an admin to view products");
        return;
      }
      const res = await api.adminGetProducts();
      setProducts(Array.isArray(res.data) ? res.data : res.data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("❌ Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;

    const formData = new FormData();
    for (let file of files) formData.append("images", file);

    try {
      setUploading(true);
      const res = await uploadImages(formData);
      if (!res?.data?.images) throw new Error("Upload failed");
      setImageUrls(res.data.images);
      toast.success("✅ Images uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("❌ Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdd = async () => {
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
        isHot,
        size,
        color,
        stock,
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
      console.error(err);
      toast.error("❌ Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.adminDeleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("🗑️ Product deleted");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete product");
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Manage Products
      </h2>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name"
          className="border p-2 w-full mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"
          className="border p-2 w-full mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="Price"
          className="border p-2 w-full mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category"
          className="border p-2 w-full mb-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />

        <div className="grid md:grid-cols-2 gap-2 mb-3">
          <input value={size} onChange={(e) => setSize(e.target.value)} placeholder="Size (optional)"
            className="border p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          <input value={color} onChange={(e) => setColor(e.target.value)} placeholder="Colour (optional)"
            className="border p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        </div>

        <div className="grid md:grid-cols-2 gap-2 mb-3">
          <input value={stock} onChange={(e) => setStock(e.target.value)} type="number" placeholder="Stock quantity (optional)"
            className="border p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          <label className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <input type="checkbox" checked={isHot} onChange={(e) => setIsHot(e.target.checked)} className="w-4 h-4" />
            Hot Product (🔥 Trending)
          </label>
        </div>

        <input type="file" multiple onChange={handleUpload} className="mb-2" />
        {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
        <div className="flex gap-2 mb-2 flex-wrap">
          {imageUrls.map((url, i) => (
            <div key={i} className="relative">
              <img src={url} alt="preview" className="w-20 h-20 object-cover rounded border" />
              <button onClick={() => handleRemoveImage(i)} className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5">
                ×
              </button>
            </div>
          ))}
        </div>

        <button onClick={handleAdd} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
          {loading ? "Adding..." : "Add Product"}
        </button>
      </div>

      {/* List existing products */}
      <div className="grid gap-3">
        {products.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 italic">No products. Add one above 👆</div>
        ) : (
          products.map((p) => (
            <div key={p.id} className="bg-white dark:bg-gray-800 p-3 rounded flex items-center gap-3 shadow">
<img
  src={
    Array.isArray(p.images)
      ? (p.images[0]?.url || p.images[0] || "/placeholder.png")
      : (p.image || "/placeholder.png")
  }
  alt={p.name}
  className="w-40 h-40 object-cover group-hover:scale-105 transition-transform"
/>

              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">{p.name}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">Ksh {p.price}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {p.size && <>Size: {p.size} · </>}
                  {p.color && <>Color: {p.color} · </>}
                  {p.stock && <>Stock: {p.stock}</>}
                  {p.isHot && <span className="ml-1 text-red-500 font-semibold">🔥 Hot</span>}
                </div>
              </div>
              <div className="ml-auto flex gap-4">
                <button className="text-blue-600 dark:text-blue-400" onClick={() => setEditingProduct(p)}>Edit</button>
                <button className="text-red-600 dark:text-red-400" onClick={() => handleDelete(p.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {editingProduct && (
        <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} onUpdated={fetchProducts} />
      )}
    </div>
  );
}
