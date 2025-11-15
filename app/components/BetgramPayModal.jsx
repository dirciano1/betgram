"use client";

import { useState, useEffect } from "react";
import { db, doc, onSnapshot } from "../../lib/firebase";

export default function BetgramPayModal({ user, onClose }) {
  const [planoSelecionado, setPlanoSelecionado] = useState(null);
  const [qrCodeBase64, setQrCodeBase64] = useState("");
  const [statusPagamento, setStatusPagamento] = useState("inicial");

  // 🔥 ESCUTA EM TEMPO REAL PARA DETECTAR PAGAMENTO
  useEffect(() => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;

      const dados = snap.data();

      // Se o crédito aumentou → pagamento confirmado
      if (dados.creditos > (user.creditos || 0)) {
        setStatusPagamento("confirmado");
      }
    });

    return () => unsub();
  }, [user]);

  async function gerarPagamento() {
    if (!planoSelecionado) return alert("Selecione um plano");

    setStatusPagamento("gerando");

    try {
      const res = await fetch("/api/pix/create", {
        method: "POST",
        body: JSON.stringify({
          uid: user.uid,
          valor: planoSelecionado.valor,
        }),
      });

      const data = await res.json();

      if (!data.qrCodeBase64) {
        alert("Erro ao gerar pagamento.");
        return;
      }

      setQrCodeBase64(data.qrCodeBase64);
      setStatusPagamento("aguardando");
    } catch (e) {
      console.error(e);
      alert("Erro ao gerar pagamento.");
    }
  }

  // Estilos
  const fundo = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  };

  const box = {
    background: "#0b1324",
    padding: "30px",
    borderRadius: "16px",
    width: "90%",
    maxWidth: "420px",
    border: "1px solid rgba(34,197,94,0.3)",
    boxShadow: "0 0 20px rgba(34,197,94,0.2)",
    textAlign: "center",
  };

  const botao = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "10px",
  };

  const planos = [
    { creditos: 10, valor: 10 },
    { creditos: 25, valor: 20 },
    { creditos: 70, valor: 50 },
    { creditos: 150, valor: 99 },
  ];

  return (
    <div style={fundo}>
      <div style={box}>
        {/* ================================ */}
        {/* ESTADO: PAGAMENTO CONFIRMADO */}
        {/* ================================ */}
        {statusPagamento === "confirmado" && (
          <>
            <h2 style={{ color: "#22c55e" }}>Pagamento Confirmado!</h2>
            <p style={{ color: "#ccc" }}>
              Seus créditos foram liberados automaticamente ✔
            </p>

            <button
              onClick={onClose}
              style={{ ...botao, background: "#22c55e", color: "#fff" }}
            >
              Fechar
            </button>
          </>
        )}

        {/* ================================ */}
        {/* ESTADO INICIAL → ESCOLHA DE PLANO */}
        {/* ================================ */}
        {statusPagamento === "inicial" && (
          <>
            <h2 style={{ color: "#22c55e" }}>Adicionar Créditos</h2>
            <p style={{ color: "#ccc", marginBottom: "10px" }}>
              Escolha um plano para gerar o pagamento PIX.
            </p>

            {planos.map((p, i) => (
              <div
                key={i}
                onClick={() => setPlanoSelecionado(p)}
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  margin: "8px 0",
                  cursor: "pointer",
                  border:
                    planoSelecionado?.valor === p.valor
                      ? "2px solid #22c55e"
                      : "1px solid rgba(255,255,255,0.1)",
                  background:
                    planoSelecionado?.valor === p.valor
                      ? "rgba(34,197,94,0.15)"
                      : "rgba(255,255,255,0.05)",
                }}
              >
                <b style={{ color: "#fff" }}>{p.creditos} créditos</b>
                <div style={{ color: "#22c55e" }}>R$ {p.valor}</div>
              </div>
            ))}

            <button
              onClick={gerarPagamento}
              style={{
                ...botao,
                background: "#22c55e",
                color: "#fff",
              }}
            >
              Gerar Pagamento
            </button>

            <button
              onClick={onClose}
              style={{
                ...botao,
                background: "rgba(239,68,68,0.2)",
                color: "#f87171",
              }}
            >
              Cancelar
            </button>
          </>
        )}

        {/* ================================ */}
        {/* ESTADO: GERANDO PAGAMENTO */}
        {/* ================================ */}
        {statusPagamento === "gerando" && (
          <>
            <h2 style={{ color: "#22c55e" }}>Gerando pagamento…</h2>
            <p style={{ color: "#ccc" }}>Aguarde um momento…</p>
          </>
        )}

        {/* ================================ */}
        {/* ESTADO: AGUARDANDO PAGAMENTO */}
        {/* ================================ */}
        {statusPagamento === "aguardando" && (
          <>
            <h2 style={{ color: "#22c55e" }}>Aguardando Pagamento…</h2>
            <p style={{ color: "#ccc" }}>
              Escaneie o QR Code abaixo para pagar com PIX.
            </p>

            {qrCodeBase64 && (
              <img
                src={`data:image/png;base64,${qrCodeBase64}`}
                alt="QR Code"
                style={{
                  width: "220px",
                  height: "220px",
                  margin: "15px auto",
                  display: "block",
                  borderRadius: "10px",
                }}
              />
            )}

            <button
              onClick={() => setStatusPagamento("gerando")}
              style={{
                ...botao,
                background: "rgba(14,165,233,0.2)",
                color: "#38bdf8",
              }}
            >
              Já paguei
            </button>

            <button
              onClick={onClose}
              style={{
                ...botao,
                background: "rgba(239,68,68,0.2)",
                color: "#f87171",
              }}
            >
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
