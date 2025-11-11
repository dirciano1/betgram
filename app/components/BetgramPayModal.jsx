"use client";
import { useState, useEffect } from "react";

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
  border: "2px solid #22c55e",
  borderRadius: "16px",
  padding: "30px",
  width: "90%",
  maxWidth: "350px",
  textAlign: "center",
  boxShadow: "0 0 30px rgba(34,197,94,0.3)",
};

const buttonConfirmStyle = {
  background: "linear-gradient(90deg, #22c55e, #16a34a)",
  border: "none",
  color: "#fff",
  fontWeight: 700,
  borderRadius: "8px",
  padding: "12px 20px",
  cursor: "pointer",
  marginTop: "15px",
  width: "100%",
};

const buttonCancelStyle = {
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

export default function BetgramPayModal({ onClose, user }) {
  const [etapa, setEtapa] = useState("planos"); // planos | pagamento | pago
  const [qr, setQr] = useState(null);
  const [txid, setTxid] = useState(null);
  const [carregando, setCarregando] = useState(false);

  async function gerarPix(valor) {
    try {
      setCarregando(true);
      const res = await fetch("/api/pix/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, amount: valor }),
      });
      const data = await res.json();
      setTxid(data.txid);
      setQr(data.qr);
      setEtapa("pagamento");
    } catch (e) {
      alert("Erro ao gerar PIX.");
      console.error(e);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    if (!txid) return;
    const i = setInterval(async () => {
      const r = await fetch(`/api/pix/status?id=${txid}`);
      const d = await r.json();
      if (d.status === "paid") {
        setEtapa("pago");
        clearInterval(i);
      }
    }, 3000);
    return () => clearInterval(i);
  }, [txid]);

  return (
    <div style={modalBackdropStyle}>
      <div style={modalContentStyle}>
        {etapa === "planos" && (
          <>
            <h3 style={{ color: "#22c55e" }}>💳 Betgram Pay</h3>
            <p style={{ color: "#ccc" }}>Escolha um plano de créditos:</p>
            <button style={buttonConfirmStyle} onClick={() => gerarPix(10)}>
              100 Análises – R$ 10,00
            </button>
            <button style={buttonConfirmStyle} onClick={() => gerarPix(25)}>
              300 Análises – R$ 25,00
            </button>
            <button style={buttonConfirmStyle} onClick={() => gerarPix(50)}>
              700 Análises – R$ 50,00
            </button>
            <button onClick={onClose} style={buttonCancelStyle}>
              ↩ Voltar
            </button>
          </>
        )}

        {etapa === "pagamento" && (
          <>
            <h3 style={{ color: "#22c55e" }}>Escaneie o QR PIX</h3>
            {carregando ? (
              <p>Gerando QR...</p>
            ) : (
              <>
                <img src={`data:image/png;base64,${qr}`} width="180" />
                <textarea
                  readOnly
                  value={qr}
                  style={{
                    width: "100%",
                    height: "80px",
                    marginTop: "10px",
                    background: "#0b1324",
                    color: "#fff",
                    border: "1px solid #22c55e55",
                    borderRadius: "8px",
                    padding: "6px",
                    fontSize: "0.8rem",
                  }}
                />
                <p style={{ color: "#ccc" }}>Aguardando pagamento...</p>
                <button onClick={onClose} style={buttonCancelStyle}>
                  Cancelar
                </button>
              </>
            )}
          </>
        )}

        {etapa === "pago" && (
          <>
            <h3 style={{ color: "#22c55e" }}>✅ Pagamento confirmado!</h3>
            <p style={{ color: "#ccc" }}>
              Seus créditos foram adicionados com sucesso.
            </p>
            <button onClick={onClose} style={buttonConfirmStyle}>
              Fechar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
