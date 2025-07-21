// 📁 src/routes.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import BookmarkList from "./pages/BookmarkList";
import AuditLogPage from "./pages/AuditLogPage";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import BookmarkList from "./pages/BookmarkList";
import AuditLogPage from "./pages/AuditLogPage";
import AppLayout from "./layouts/AppLayout"; // nếu có

const AppRoutes = () => {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app" />} />

      {/* ✅ Add this */}
      <Route path="/app/*" element={<AppLayout />}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="bookmarks" element={<BookmarkList />} />
        <Route path="audit" element={<AuditLogPage />} />
      </Route>

      <Route path="*" element={<div className="text-white p-8">404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
