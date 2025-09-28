import React, { useEffect, useState } from "react";
import api from "../../api/index.js";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard(){
  const [analytics, setAnalytics] = useState([]);
  useEffect(()=>{
    (async ()=> {
      const res = await api.adminGetAnalytics();
      setAnalytics(res.data?.salesByDay || []);
    })();
  },[]);
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="bg-white p-4 rounded">
        <h3 className="font-semibold mb-2">Sales (Recent)</h3>
        <div style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer>
            <LineChart data={analytics}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line dataKey="total" stroke="#0369a1" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
