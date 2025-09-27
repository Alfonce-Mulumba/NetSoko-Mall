import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState([]);

  useEffect(()=> {
    api.get("/api/admin/analytics").then(r=>setAnalytics(r.data)).catch(()=>{});
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="card">
        <h3 className="mb-2">Sales (last 7 days)</h3>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <LineChart data={analytics}>
              <CartesianGrid stroke="#eee" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
