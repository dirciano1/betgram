"use client";

import Sidebar from "./componentes/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 20 }}>
        {children}
      </main>
    </div>
  );
}
