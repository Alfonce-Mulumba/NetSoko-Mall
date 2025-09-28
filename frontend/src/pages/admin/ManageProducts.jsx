import React, { useEffect, useState } from "react";
import api from "../../api/index.js";

export default function ManageProducts(){
  const [products, setProducts] = useState([]);
  useEffect(()=>{ (async ()=> { const r=await api.adminGetProducts(); setProducts(r.data);} )();},[]);
  const remove = async (id)=>{ if(!confirm("Delete?")) return; await api.adminDeleteProduct(id); setProducts(products.filter(p=>p.id!==id)); };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      <div className="grid gap-3">
        {products.map(p=>(
          <div key={p.id} className="bg-white p-3 rounded flex items-center gap-3">
            <img src={p.images?.[0]?.url || ""} className="w-20 h-20 object-cover rounded" />
            <div>
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm">Ksh {p.price}</div>
            </div>
            <div className="ml-auto">
              <button className="text-red-600" onClick={()=>remove(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
