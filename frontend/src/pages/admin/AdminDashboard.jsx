import React, { useEffect, useState } from "react";
import api from "../../api";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  // Detect dark theme
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDark, setIsDark] = useState(prefersDark);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setIsDark(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  // --- Fetch dashboard data (same logic as AdminAnalytics)
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, complaintsRes] = await Promise.all([
        api.adminGetAnalytics("month"), // timeframe optional
        api.adminGetComplaints(),
      ]);
      setAnalytics(analyticsRes.data);
      setComplaints(complaintsRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // --- Handle complaint status update
  const handleStatusChange = async (id, currentStatus) => {
    try {
      setUpdating(id);
      await api.adminMarkComplaintRead(id);
      setComplaints((prev) =>
        prev.map((c) =>
          c._id === id
            ? { ...c, status: currentStatus === "unread" ? "read" : "unread" }
            : c
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
      >
        Loading dashboard...
      </div>
    );
  }

  const totals = analytics?.totals || {
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* --- Header --- */}
        <h1 className="text-2xl sm:text-3xl font-semibold">🛠️ Performance & Complaints</h1>

        {/* --- Analytics Cards --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <DashboardCard title="Users" value={totals.totalUsers} color="blue" />
          <DashboardCard title="Orders" value={totals.totalOrders} color="green" />
          <DashboardCard title="Products" value={totals.totalProducts} color="sky" />
          <DashboardCard title="Pending" value={totals.pendingOrders} color="emerald" />
        </div>

        {/* --- Complaints Table --- */}
        <div
          className={`rounded-2xl shadow-md overflow-x-auto ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`${
                  isDark
                    ? "bg-gray-700 text-gray-200"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <th className="px-4 py-3 text-sm font-semibold">User ID</th>
                <th className="px-4 py-3 text-sm font-semibold">Email</th>
                <th className="px-4 py-3 text-sm font-semibold">Complaint</th>
                <th className="px-4 py-3 text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-sm font-semibold">Date Sent</th>
              </tr>
            </thead>
            <tbody>
              {complaints.length > 0 ? (
                complaints.map((c) => (
                  <tr
                    key={c._id}
                    className={`border-t ${
                      isDark
                        ? "border-gray-700 hover:bg-gray-700"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3 text-sm">{c.user?._id || "N/A"}</td>
                    <td className="px-4 py-3 text-sm">{c.user?.email || "N/A"}</td>
                    <td className="px-4 py-3 text-sm max-w-sm truncate">
                      {c.message}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => handleStatusChange(c._id, c.status)}
                        disabled={updating === c._id}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          c.status === "unread"
                            ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                            : "bg-green-500/20 text-green-500 hover:bg-green-500/30"
                        } transition-colors duration-150`}
                      >
                        {updating === c._id
                          ? "Updating..."
                          : c.status === "unread"
                          ? "Unread"
                          : "Read"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(c.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                  >
                    No complaints found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- Dashboard Card Component ---
function DashboardCard({ title, value, color }) {
  const colors = {
    blue: "from-blue-500/10 to-blue-500/20",
    green: "from-green-500/10 to-green-500/20",
    sky: "from-sky-500/10 to-sky-500/20",
    emerald: "from-emerald-500/10 to-emerald-500/20",
  };
  return (
    <div
      className={`p-5 bg-gradient-to-br ${colors[color]} rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200`}
    >
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
}
