import React, { useEffect, useState } from "react";

const Analytics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats(data);
    };
    fetchStats();
  }, []);

  if (!stats) return <p>Loading analytics...</p>;

  return (
    <div>
      <h2>📈 Analytics</h2>
      <p>Users: {stats.totalUsers}</p>
      <p>Products: {stats.totalProducts}</p>
      <p>Orders: {stats.totalOrders}</p>
      <p>Pending Orders: {stats.pendingOrders}</p>
    </div>
  );
};

export default Analytics;
