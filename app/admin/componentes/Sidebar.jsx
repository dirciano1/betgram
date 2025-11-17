"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Usuários", path: "/admin/usuarios", icon: "👥" },
    { name: "Análises", path: "/admin/analises", icon: "📄" },
  ];

  return (
    <div
      style={{
        width: 240,
        background: "rgba(15,23,42,0.95)",
        minHeight: "100vh",
        padding: "30px 18px",
        borderRight: "1px solid rgba(34,197,94,0.25)",
        boxShadow: "0 0 20px rgba(34,197,94,0.15)",
        position: "sticky",
        top: 0,
      }}
    >
      <h2
        style={{
          fontSize: "1.4rem",
          fontWeight: 700,
          color: "#22c55e",
          marginBottom: 30,
          textAlign: "center",
        }}
      >
        ⚙️ BetGram Admin
      </h2>

      {menu.map((item) => {
        const active = pathname === item.path;

        return (
          <Link key={item.path} href={item.path}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 14px",
                marginBottom: 10,
                borderRadius: 10,
                color: active ? "#22c55e" : "#fff",
                background: active
                  ? "rgba(34,197,94,0.15)"
                  : "transparent",
                border: active
                  ? "1px solid rgba(34,197,94,0.4)"
                  : "1px solid transparent",
                textDecoration: "none",
                transition: "0.2s",
                fontWeight: active ? 700 : 500,
                cursor: "pointer",
              }}
            >
              <span style={{ marginRight: 10 }}>{item.icon}</span>
              {item.name}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
