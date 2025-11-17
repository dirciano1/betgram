"use client";

import { useEffect, useState } from "react";
import {
  db,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "../../../lib/firebase";

// Formata a data bonitinha
function formatarData(timestamp) {
  if (!timestamp) return "-";
  try {
    return new Date(timestamp).toLocaleString("pt-BR");
  } catch {
    return String(timestamp);
  }
}

// Corta o texto da análise para caber na tabela
function resumoAnalise(texto = "", max = 160) {
  if (!texto) return "-";
  const clean = texto.replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max) + "..." : clean;
}

export default function AnalisesAdmin() {
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [analiseSelecionada, setAnaliseSelecionada] = useState(null);
  const [filtro, setFiltro] = useState(""); // 🔥 NOVO ESTADO

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setCarregando(true);
    try {
      const snap = await getDocs(collection(db, "analises"));
      const arr = [];
      snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
      
      arr.sort((a, b) =>
        (b.timestamp || "").localeCompare(a.timestamp || "")
      );

      setLista(arr);
    } catch (e) {
      console.error("Erro ao carregar análises:", e);
      alert("Erro ao carregar análises.");
    } finally {
      setCarregando(false);
    }
  }

  async function excluir(id) {
    const ok = window.confirm("Tem certeza que deseja excluir esta análise?");
    if (!ok) return;

    try {
      await deleteDoc(doc(db, "analises", id));
      setLista((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error("Erro ao excluir análise:", e);
      alert("Erro ao excluir análise: " + e.message);
    }
  }

  // 🔥 LISTA FILTRADA (Nome ou Email)
  const listaFiltrada = lista.filter((item) => {
    const texto = filtro.toLowerCase();
    const nome = (item.nome || item.userEmail || "").toLowerCase();
    return nome.includes(texto);
  });

  return (
    <div>
      <h1
        style={{
          fontSize: 26,
          color: "#22c55e",
          marginBottom: 20,
        }}
      >
        Gerenciar Análises
      </h1>

      {/* 🔥 CAMPO DE BUSCA */}
      <input
        type="text"
        placeholder="Filtrar por nome do usuário..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: 8,
          background: "#0f172a",
          border: "1px solid #22c55e55",
          color: "#fff",
          marginBottom: 20,
        }}
      />

      {carregando ? (
        <p style={{ color: "#94a3b8" }}>Carregando análises...</p>
      ) : listaFiltrada.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>Nenhuma análise encontrada.</p>
      ) : (
        <table
          style={{
            width: "100%",
            marginTop: 10,
            borderCollapse: "collapse",
            fontSize: "0.95rem",
          }}
        >
          <thead>
            <tr style={{ color: "#22c55e", textAlign: "left" }}>
              <th style={{ padding: "8px 6px" }}>Usuário</th>
              <th style={{ padding: "8px 6px" }}>Confronto</th>
              <th style={{ padding: "8px 6px" }}>Data</th>
              <th style={{ padding: "8px 6px" }}>Resumo</th>
              <th style={{ padding: "8px 6px", textAlign: "center" }}>Ações</th>
            </tr>
          </thead>

          <tbody>
            {listaFiltrada.map((a) => (
              <tr
                key={a.id}
                style={{
                  borderTop: "1px solid rgba(148,163,184,0.25)",
                }}
              >
                <td style={{ padding: "8px 6px", color: "#e5e7eb" }}>
                  {a.nome || a.userEmail || "-"}
                </td>

                <td style={{ padding: "8px 6px", color: "#f97316" }}>
                  {a.confronto || "-"}
                </td>

                <td style={{ padding: "8px 6px", color: "#94a3b8" }}>
                  {formatarData(a.timestamp)}
                </td>

                <td
                  style={{
                    padding: "8px 6px",
                    color: "#cbd5f5",
                    maxWidth: 420,
                  }}
                >
                  {resumoAnalise(a.resposta)}
                  {a.resposta && a.resposta.length > 160 && (
                    <button
                      onClick={() => setAnaliseSelecionada(a)}
                      style={{
                        marginLeft: 8,
                        background: "transparent",
                        border: "none",
                        color: "#38bdf8",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        textDecoration: "underline",
                      }}
                    >
                      ver mais
                    </button>
                  )}
                </td>

                <td
                  style={{
                    padding: "8px 6px",
                    textAlign: "center",
                  }}
                >
                  <button
                    onClick={() => excluir(a.id)}
                    style={{
                      background: "#22c55e",
                      border: "none",
                      color: "#020617",
                      fontWeight: 700,
                      borderRadius: 999,
                      padding: "8px 16px",
                      cursor: "pointer",
                    }}
                  >
                    Excluir análise
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {analiseSelecionada && (
        <div
          onClick={() => setAnaliseSelecionada(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#020617",
              borderRadius: 16,
              border: "1px solid rgba(34,197,94,0.4)",
              padding: 20,
              maxWidth: 800,
              maxHeight: "80vh",
              overflowY: "auto",
              color: "#e5e7eb",
            }}
          >
            <h2 style={{ color: "#22c55e", marginBottom: 10 }}>
              {analiseSelecionada.confronto || "Análise"}
            </h2>

            <p
              style={{
                color: "#94a3b8",
                fontSize: "0.9rem",
                marginBottom: 10,
              }}
            >
              {formatarData(analiseSelecionada.timestamp)} •{" "}
              {analiseSelecionada.nome || analiseSelecionada.userEmail || ""}
            </p>

            <pre
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.5,
                fontFamily: "inherit",
              }}
            >
              {analiseSelecionada.resposta}
            </pre>

            <button
              onClick={() => setAnaliseSelecionada(null)}
              style={{
                marginTop: 16,
                background: "rgba(148,163,184,0.15)",
                border: "1px solid rgba(148,163,184,0.5)",
                color: "#e5e7eb",
                borderRadius: 999,
                padding: "8px 18px",
                cursor: "pointer",
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
