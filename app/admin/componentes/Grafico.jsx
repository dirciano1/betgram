"use client";

export default function Grafico() {
  return (
    <div
      style={{
        background: "rgba(15,23,42,0.8)",
        border: "1px solid rgba(34,197,94,0.25)",
        padding: 25,
        borderRadius: 16,
        color: "#fff",
        minHeight: 220,
        textAlign: "center",
        boxShadow: "0 0 20px rgba(34,197,94,0.1)",
      }}
    >
      <h2 style={{ color: "#22c55e", marginBottom: 8 }}>
        📊 Gráfico em Desenvolvimento
      </h2>

      <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
        Em breve você verá visualizações reais do sistema aqui!
      </p>

      <div
        style={{
          marginTop: 25,
          opacity: 0.5,
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/1828/1828778.png"
          alt="Loading chart"
          style={{ width: 60, height: 60 }}
        />
      </div>
    </div>
  );
}
