import React, { useEffect, useState } from "react";
import axios from "axios";

const DashboardPage = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    axios.get("/api/statistics/summary")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error fetching stats", err));
  }, []);

  if (!stats) {
    return <div className="text-white p-8">Loading...</div>;
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard Statistics</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg">Total Bookmarks</h2>
          <p className="text-2xl font-bold">{stats.totalBookmarks}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg">Total Collections</h2>
          <p className="text-2xl font-bold">{stats.totalCollections}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg">Total Users</h2>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
