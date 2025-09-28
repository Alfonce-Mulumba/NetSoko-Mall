import React, { useEffect, useState } from "react";
import api from "../../api/index.js";

export default function ManageUsers(){
  const [users, setUsers] = useState([]);
  useEffect(()=>{ (async ()=>{ const r=await api.adminGetUsers(); setUsers(r.data); })(); },[]);
  const del=async (id)=>{ if(!confirm("Delete user?")) return; await api.adminDeleteUser(id); setUsers(users.filter(u=>u.id!==id)); };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <div className="bg-white p-3 rounded space-y-2">
        {users.map(u=>(
          <div key={u.id} className="flex justify-between items-center">
            <div>{u.name} — {u.email}</div>
            <div><button className="text-red-600" onClick={()=>del(u.id)}>Delete</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
