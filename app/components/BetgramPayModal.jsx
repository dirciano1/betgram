"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "../../../lib/firebase";

export default function BetgramPayModal({
  user,
  qrCodeBase64,
  valor,
  fecharModal,
}) {
  const [statusPagamento, setStatusPagamento] = useState("aguardando"); 
  // aguardando | confirmado | cancelado

  useEffect(() => {
    if (!user) return;

    const userRef = doc(
      (await import("../../../lib/firebase")).db,
      "users",
      user.uid
    );

    // 🔥 LISTENER REAL-TIME (ATUALIZA MESMO COM MODAL ABERTO)
    const unsub = onSnapshot(userRef, (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();

      if (data.creditos > user.creditos) {
        console.log("🔥 Pagamento confirmado pelo webhook!");
        setStatusPagamento("confirmado");
      }
    });

    return () => unsub();
  }, [user]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "420px",
          background: "#111827",
          padding: "24px",
          borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.1)",
          textAlign: "center",
          color: "#fff",
          boxShadow: "0 0 20px rgba(0,0,0,0.4)",
        }}
      >
        {/* ESTADO 1 — Aguardando Pagamento */}
        {statusPagamento === "aguardando" && (
          <>
            <h2 style={{ fontSize: "1.3rem", marginBottom: "8px" }}>
              Finalizar Pagamento
            </h2>

            <p style={{ opacity: 0.8, marginBottom: "14px" }}>
              Escaneie o QR Code para pagar{" "}
              <strong style={{ color: "#4ade80" }}>R$ {valor}</strong>
            </p>

            <img
              src={`data:image/png;base64,${qrCodeBase64}`}
              alt="QR Code PIX"
              style={{
                width: "200px",
                height: "200px",
                margin: "0 auto",
                borderRadius: "8px",
                boxShadow: "0 0 12px rgba(0,0,0,0.6)",
              }}
            />

            <p style={{ fontSize: "0.9rem", marginTop: "12px", opacity: 0.8 }}>
              Assim que o pagamento for confirmado, liberaremos seus créditos
              automaticamente.
            </p>

            <button
              onClick={() => fecharModal()}
              style={{
                marginTop: "18px",
                width: "100%",
                padding: "12px",
                background: "#ef4444",
                borderRadius: "8px",
                border: "none",
                color: "#fff",
                fontSize: "1rem",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Cancelar
            </button>
          </>
        )}

        {/* ESTADO 2 — Pagamento Confirmado */}
        {statusPagamento === "confirmado" && (
          <>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "10px", color: "#4ade80" }}>
              Pagamento Confirmado!
            </h2>

            <p style={{ opacity: 0.9, marginBottom: "20px" }}>
              Seus créditos foram liberados automaticamente ✔
            </p>

            <button
              onClick={fecharModal}
              style={{
                marginTop: "12px",
                width: "100%",
                padding: "12px",
                background: "#22c55e",
                borderRadius: "8px",
                border: "none",
                color: "#fff",
                fontSize: "1rem",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Fechar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
