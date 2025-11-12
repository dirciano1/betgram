"use client";
import { useState } from "react";

const modalBackdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  background: "#111827",
  border: "2px solid #3b82f6",
  borderRadius: "16px",
  padding: "30px",
  width: "90%",
  maxWidth: "350px",
  textAlign: "center",
  boxShadow: "0 0 30px rgba(59,130,246,0.3)",
};

const buttonStyle = {
  background: "linear-gradient(90deg, #3b82f6, #2563eb)",
  border: "none",
  color: "#fff",
  fontWeight: 700,
  borderRadius: "8px",
  padding: "12px 20px",
  cursor: "pointer",
  marginTop: "15px",
  width: "100%",
};

const cancelStyle = {
  background: "rgba(239,68,68,0.15)",
  border: "1px solid #ef444455",
  color: "#f87171",
  fontWeight: 600,
  borderRadius: "8px",
  padding: "12px 20px",
  cursor: "pointer",
  marginTop: "15px",
  width: "100%",
};

export default function IndiqueModal({ onClose, user }) {
  const [copiado, setCopiado] = useState(false);
  const link = `https://betgram.com.br/?ref=${user?.uid || "amigo"}`;

  function copiarLink() {
    navigator.clipboard.writeText(link);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div style={modalBackdropStyle}>
      <div style={modalContentStyle}>
        <h3 style={{ color: "#3b82f6" }}>🎁 Indique e Ganhe!</h3>
        <p style={{ color: "#ccc" }}>
          Convide seus amigos para usar o <b>Betgram IA</b>.<br />
          Quando eles se cadastrarem com seu link, você ganha{" "}
          <span style={{ color: "#22c55e" }}>20 análises grátis!</span>
        </p>

        <textarea
          readOnly
          value={link}
          style={{
            width: "100%",
            height: "70px",
            marginTop: "10px",
            background: "#0b1324",
            color: "#fff",
            border: "1px solid #3b82f655",
            borderRadius: "8px",
            padding: "6px",
            fontSize: "0.8rem",
            textAlign: "center",
          }}
        />

        <button style={buttonStyle} onClick={copiarLink}>
          {copiado ? "✅ Link copiado!" : "📋 Copiar Link de Indicação"}
        </button>

        <button style={cancelStyle} onClick={onClose}>
          ↩ Voltar
        </button>
      </div>
    </div>
  );
}
