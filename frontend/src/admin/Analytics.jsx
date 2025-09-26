import React from "react";

const Analytics = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-green-600">Analytics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-green-600 font-bold">Total Sales</h3>
          <p className="text-2xl font-semibold">KES 120,000</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-green-600 font-bold">Orders</h3>
          <p className="text-2xl font-semibold">540</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-green-600 font-bold">Users</h3>
          <p className="text-2xl font-semibold">320</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-green-600 font-bold">Pending Orders</h3>
          <p className="text-2xl font-semibold">12</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
