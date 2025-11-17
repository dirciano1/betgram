"use client";

import Sidebar from "./components/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-container" style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "20px" }}>
        {children}
      </main>
    </div>
  );
}
