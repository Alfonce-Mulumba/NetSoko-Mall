import React, { useEffect, useState } from "react";
import api from "../../api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#60A5FA", "#34D399", "#2563EB"];

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [timeframe, setTimeframe] = useState("week");
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async (tf = timeframe) => {
    try {
      setLoading(true);
      const res = await api.adminGetAnalytics(tf);
      setAnalytics(res.data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(timeframe);
  }, [timeframe]);

  if (loading) return <div className="p-6 text-center">Loading analytics...</div>;
  if (!analytics) return <div className="p-6 text-center">No analytics data found.</div>;

  const { totals, salesOverTime, topProducts, stockLevels } = analytics;

  return (
    <div className="p-4 md:p-6 space-y-8 transition-colors duration-300">
      {/* ===== Header & Timeframe Switch ===== */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">📊 Admin Analytics</h1>
        <div className="flex gap-2">
          {["day", "week", "month", "year"].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
                timeframe === tf
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {tf.charAt(0).toUpperCase() + tf.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ===== Summary Cards (Circular style) ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { title: "Users", value: totals.totalUsers, color: "bg-blue-500" },
          { title: "Orders", value: totals.totalOrders, color: "bg-green-500" },
          { title: "Products", value: totals.totalProducts, color: "bg-sky-500" },
          { title: "Pending", value: totals.pendingOrders, color: "bg-emerald-500" },
        ].map((item) => (
          <div
            key={item.title}
            className={`${item.color} rounded-full shadow-lg text-white flex flex-col justify-center items-center w-32 h-32 mx-auto md:w-36 md:h-36 hover:scale-105 transition-transform`}
          >
            <span className="text-xs opacity-80">{item.title}</span>
            <span className="text-2xl font-bold">{item.value}</span>
          </div>
        ))}
      </div>

      {/* ===== Line Graph: Sales & Users Over Time ===== */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
          Sales & User Growth
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={salesOverTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "gray" }} />
            <YAxis domain={[0, 1000]} tick={{ fontSize: 11, fill: "gray" }} />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="users" stroke="#60A5FA" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ===== Bar Chart: Top Products ===== */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
          Top Selling Products
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topProducts}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" hide />
            <YAxis domain={[0, 1000]} />
            <Tooltip />
            <Bar dataKey="sales" fill="#10B981" barSize={20} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-2 mt-3 text-sm text-gray-600 dark:text-gray-300">
          {topProducts.map((p) => (
            <span
              key={p.name}
              className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700"
            >
              {p.name}
            </span>
          ))}
        </div>
      </div>

      {/* ===== Stock Level Chart ===== */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
          Stock Levels Overview
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={stockLevels}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" hide />
            <YAxis domain={[0, 1000]} />
            <Tooltip />
            <Bar dataKey="stock" fill="#3B82F6" barSize={18} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ===== Donut Chart ===== */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
          Sales Distribution
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={topProducts}
              dataKey="sales"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
            >
              {topProducts.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
