import React, { useEffect, useState } from "react";
import api from "../../api/index.js";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    (async () => {
      const r = await api.adminGetProducts();
      setProducts(r.data);
    })();
  }, []);

  const remove = async (id) => {
    if (!confirm("Delete?")) return;
    await api.adminDeleteProduct(id);
    setProducts(products.filter((p) => p.id !== id));
  };

const handleUpload = async (e) => {
  const files = e.target.files;
  const formData = new FormData();
  for (let f of files) {
    formData.append("images", f);
  }

  const res = await fetch("http://localhost:5000/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  console.log("Uploaded:", data.urls);
  setImageUrls(data.urls);
};

  const handleAdd = async (e) => {
    e.preventDefault();
    const body = {
      name,
      description,
      price,
      category,
      images,
    };
    const r = await api.adminCreateProductsBulkJSON(body);
    setProducts([...products, r.data]);
    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setImages([]);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>

      {/* add product form */}
      <form onSubmit={handleAdd} className="space-y-3 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product name"
          className="border p-2 w-full"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="border p-2 w-full"
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="border p-2 w-full"
        />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="border p-2 w-full"
        />

        <input type="file" multiple onChange={handleUpload} />

        <div className="flex gap-2">
          {images.map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              className="w-16 h-16 object-cover rounded"
            />
          ))}
        </div>

        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
          Add Product
        </button>
      </form>

      {/* list products */}
      <div className="grid gap-3">
        {products.map((p) => (
          <div key={p.id} className="bg-white p-3 rounded flex items-center gap-3">
            <img
              src={p.images?.[0]?.url || ""}
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm">Ksh {p.price}</div>
            </div>
            <div className="ml-auto">
              <button className="text-red-600" onClick={() => remove(p.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
