import React, { useState } from "react";
import { toast } from "react-toastify";
import { uploadImages } from "../../api/index.js";
import api from "../../api/index.js";

export default function EditProductModal({ product, onClose, onUpdated }) {
  const [name, setName] = useState(product.name || "");
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(product.price || "");
  const [category, setCategory] = useState(product.category || "");
  const [discount, setDiscount] = useState(product.discount || 0);
  const [hot, setHot] = useState(product.isHot || product.hot || false);
  const [imageUrls, setImageUrls] = useState(
    Array.isArray(product.images)
      ? product.images.map((img) => (typeof img === "string" ? img : img.url))
      : []
  );
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach((f) => formData.append("images", f));

    try {
      const res = await uploadImages(formData);
      setImageUrls((prev) => [...prev, ...res.data.images]);
      toast.success("✅ Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Image upload failed");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.adminUpdateProduct(product.id, {
        name,
        description,
        price,
        category,
        discount,
        isHot: hot,
        images: imageUrls,
      });
      toast.success("✅ Product updated!");
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Edit Product</h2>

        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name"
          className="border p-2 w-full mb-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"
          className="border p-2 w-full mb-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price"
          className="border p-2 w-full mb-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category"
          className="border p-2 w-full mb-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
        <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="Discount %"
          className="border p-2 w-full mb-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />

        <label className="flex items-center gap-2 mb-3 text-gray-900 dark:text-gray-200">
          <input type="checkbox" checked={hot} onChange={(e) => setHot(e.target.checked)} />
          <span>Hot in Market</span>
        </label>

        <input type="file" multiple onChange={handleUpload} className="mb-2" />

        <div className="flex gap-2 flex-wrap">
          {imageUrls.map((url, i) => (
            <div key={i} className="relative">
              <img src={url} alt="preview" className="w-20 h-20 object-cover rounded border" />
              <button type="button"
                onClick={() => setImageUrls((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded text-gray-800 dark:text-gray-200 dark:border-gray-600">
            Cancel
          </button>
          <button onClick={handleSave} disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
