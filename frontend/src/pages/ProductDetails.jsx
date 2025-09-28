import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/index.js";
import { CartContext } from "../context/CartContext.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { add } = useContext(CartContext);

  useEffect(() => {
    (async () => {
      const res = await api.getProductById(id);
      setProduct(res.data);
    })();
  }, [id]);

  if (!product) return <div>Loading...</div>;
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <img src={product.images?.[0]?.url || `https://placeholder.co/500?text=${product.name}`} alt={product.name} className="w-full rounded" />
        <div className="flex gap-2 mt-2">
          {product.images?.slice(0,3).map((im,i)=>(
            <img key={i} src={im.url} alt="" className="w-20 h-20 object-cover rounded" />
          ))}
        </div>
      </div>
      <div className="bg-white p-4 rounded">
        <h2 className="text-2xl font-bold">{product.name}</h2>
        <div className="text-primary text-xl mt-2">Ksh {product.price}</div>
        <p className="mt-3 text-gray-700">{product.description}</p>

        <div className="mt-4 flex items-center gap-2">
          <input type="number" min="1" value={qty} onChange={e=>setQty(Number(e.target.value))} className="w-20 p-2 border rounded" />
          <button className="ml-2 bg-primary text-white px-4 py-2 rounded" onClick={() => add(product.id, qty)}>Add to cart</button>
        </div>
      </div>
    </div>
  );
}
