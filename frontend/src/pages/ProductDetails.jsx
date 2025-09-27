import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import { CartContext } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const { add } = useContext(CartContext);

  useEffect(()=> {
    api.get(`/api/products/${id}`).then(r=>setP(r.data)).catch(()=>{});
  }, [id]);

  if (!p) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <img src={p.image||"/placeholder.png"} alt={p.name} className="w-full object-cover rounded"/>
      <div>
        <h1 className="text-2xl font-bold">{p.name}</h1>
        <p className="mt-2 text-gray-600">{p.description}</p>
        <div className="mt-4 text-2xl font-bold">${p.price}</div>
        <div className="mt-6">
          <button className="btn btn-primary mr-2" onClick={()=> { add(p,1); alert("Added to cart"); }}>Add to cart</button>
        </div>
      </div>
    </div>
  );
}
