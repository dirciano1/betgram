"use client";

export default function Card({ title, value, icon }) {
  return (
    <div
      style={{
        background: "rgba(15,23,42,0.8)",
        border: "1px solid rgba(34,197,94,0.25)",
        borderRadius: 14,
        padding: "20px 22px",
        width: 220,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 8,
        transition: "0.2s",
        boxShadow: "0 0 20px rgba(34,197,94,0.1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow = "0 0 25px rgba(34,197,94,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 0 20px rgba(34,197,94,0.1)";
      }}
    >

      <div style={{ fontSize: 28 }}>{icon}</div>

      <div style={{ fontWeight: 700, fontSize: "1.2rem", color: "#22c55e" }}>
        {title}
      </div>

      <div style={{ fontSize: "1.7rem", fontWeight: 700 }}>
        {value}
      </div>

    </div>
  );
}
