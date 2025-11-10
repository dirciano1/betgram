"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RootRedirect() {
  const router = useRouter();
  const [status, setStatus] = useState("Detectando dispositivo...");

  useEffect(() => {
    // Aguarda o carregamento completo do cliente
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        const largura = window.innerWidth;
        console.log("📏 Largura detectada:", largura);

        if (largura < 768) {
          setStatus("📱 Redirecionando para versão mobile...");
          router.replace("/mobile");
        } else {
          setStatus("💻 Redirecionando para versão desktop...");
          router.replace("/desktop");
        }
      }
    }, 300); // Pequeno delay garante leitura correta

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      style={{
        background: "#0b1324",
        color: "#22c55e",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1.4em",
        flexDirection: "column",
      }}
    >
      {status}
    </div>
  );
}
