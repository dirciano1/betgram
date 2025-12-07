"use client";

import BetgramPayModal from "../components/BetgramPayModal";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function PaymentPage() {
  const params = useSearchParams();
  const uid = params.get("uid"); // pega o uid passado no link

  const [show, setShow] = useState(false);

  useEffect(() => {
    // Abre o modal automaticamente ao carregar
    setShow(true);
  }, []);

  if (!uid) {
    return (
      <div style={{ color: "#fff", padding: "40px", textAlign: "center" }}>
        ❌ Nenhum usuário informado.  
        <br /><br />
        Use o link no formato:<br />
        <b>betgram.com.br/payments?uid=SEU_UID</b>
      </div>
    );
  }

  return (
    <main
      style={{
        width: "100%",
        height: "100vh",
        background: "linear-gradient(135deg,#0b1324,#111827)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {show && (
        <BetgramPayModal
          user={{ uid }}
          onClose={() => {
            // Fecha a aba quando terminar (opcional)
            window.close();
          }}
        />
      )}
    </main>
  );
}
