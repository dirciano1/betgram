"use client";

import { useState, useEffect } from "react";
import {
  auth,
  onAuthStateChanged,
  loginComGoogle,
  sair,
  db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "../lib/firebase";
import { gerarAnalise } from "../lib/aiClient";
import "./globals.css";

/* === ESTILO BASE DOS INPUTS === */
const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(17,24,39,0.8)",
  color: "#fff",
  marginBottom: "12px",
  outline: "none",
  transition: "0.2s",
};

/* === ESTILOS GERAIS === */
const styles = {
  container: {
    background: "#0b1324",
    color: "#fff",
    fontFamily: '"Poppins", sans-serif',
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: "20px",
  },
  mainArea: { width: "100%", maxWidth: "700px" },
};

/* === COMPONENTE PRINCIPAL === */
export default function HomePage() {
  const [user, setUser] = useState(null);
  const [dadosUser, setDadosUser] = useState(null);
  const [esporte, setEsporte] = useState("futebol");
  const [competicao, setCompeticao] = useState("");
  const [timeA, setTimeA] = useState("");
  const [timeB, setTimeB] = useState("");
  const [mercado, setMercado] = useState("");
  const [odd, setOdd] = useState("");
  const [resultado, setResultado] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [panelFlip, setPanelFlip] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [mostraHistorico, setMostraHistorico] = useState(false);

  /* === MONITORAR LOGIN === */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        await carregarDadosUsuario(u);
      } else {
        setUser(null);
      }
    });
    return () => unsub();
  }, []);

  async function carregarDadosUsuario(u) {
    const ref = doc(db, "users", u.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        nome: u.displayName || "Usuário",
        email: u.email || "",
        creditos: 10,
        admin: u.email?.includes("dirciano") || false,
      });
      setDadosUser({ nome: u.displayName, creditos: 10 });
    } else {
      setDadosUser(snap.data());
    }
  }

  async function handleLogin() {
    try {
      const u = await loginComGoogle();
      setUser(u);
      await carregarDadosUsuario(u);
    } catch (err) {
      alert("Erro ao fazer login: " + err.message);
    }
  }

  async function handleLogout() {
    await sair();
    setUser(null);
    setDadosUser(null);
    setPanelFlip(false);
    setMostraHistorico(false);
  }

  async function handleAnalise() {
    if (!user) return alert("⚠️ Faça login primeiro.");
    if (!timeA || !timeB) return alert("Preencha os dois times.");

    setCarregando(true);
    const confronto = `${timeA} x ${timeB}`;
    const modulo = await import(`../prompts/${esporte}.js`);
    const prompt = modulo.gerarPrompt(confronto, mercado, competicao, odd);

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    const dados = snap.data();

    if (dados.creditos <= 0) {
      alert("❌ Você não tem créditos suficientes.");
      setCarregando(false);
      return;
    }

    const resposta = await gerarAnalise(prompt);

    await addDoc(collection(db, "analises"), {
      uid: user.uid,
      nome: dados.nome,
      timestamp: new Date().toISOString(),
      esporte,
      competicao,
      confronto,
      mercado,
      odd,
      modelo: "gpt-4o-mini",
      resposta,
    });

    await updateDoc(ref, { creditos: dados.creditos - 1 });
    setDadosUser({ ...dados, creditos: dados.creditos - 1 });
    setResultado(resposta);
    setCarregando(false);
    setPanelFlip(true);
  }

  async function handleHistorico() {
    if (!user) return alert("⚠️ Faça login primeiro.");
    const q = query(
      collection(db, "analises"),
      where("uid", "==", user.uid),
      orderBy("timestamp", "desc"),
      limit(5)
    );
    const snap = await getDocs(q);
    const lista = snap.docs.map((d) => d.data());
    setHistorico(lista);
    setMostraHistorico(true);
  }

  function formatAnaliseTexto(texto = "") {
    return texto
      .replace(/(Mercado|Mercados)/gi, '<span style="color:#38bdf8;font-weight:600;">$1</span>')
      .replace(/(Odd[s]?:?\s*\d+(\.\d+)?)/gi, '<span style="color:#facc15;font-weight:600;">$1</span>')
      .replace(/(Recomendação|Aposta|Sugestão|Valor)/gi, '<span style="color:#22c55e;font-weight:600;">$1</span>')
      .replace(/(Justificativa|Análise|Contexto|Resumo)/gi, '<span style="color:#fb923c;font-weight:600;">$1</span>')
      .replace(/###\s*(.*)/g, '<br><strong style="color:#0ea5e9;">📘 $1</strong>')
      .replace(/\n/g, "<br>");
  }

  // === TELA INICIAL (sem login) ===
  if (!user) {
    return (
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #0b1324 0%, #111827 100%)",
          color: "#fff",
          fontFamily: "Inter, sans-serif",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "rgba(17,24,39,0.85)",
            border: "2px solid #22c55e55",
            borderRadius: "16px",
            padding: "40px 30px",
            maxWidth: "420px",
            boxShadow: "0 0 25px rgba(34,197,94,0.15)",
            animation: "fadeIn 1s ease",
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: "1.8rem", fontWeight: 700 }}>
            🤖 Bem-vindo ao <span style={{ color: "#22c55e" }}>Betgram IA</span>
          </h2>

          <p style={{ color: "#ccc", margin: "10px 0 20px" }}>
            Gere análises inteligentes e descubra as melhores apostas em segundos.
          </p>

          <div
            style={{
              background: "linear-gradient(90deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05))",
              border: "1px solid #22c55e55",
              borderRadius: "12px",
              padding: "15px 20px",
              color: "#a7f3d0",
              marginBottom: "25px",
              fontSize: "0.95rem",
              lineHeight: "1.5",
            }}
          >
            🎁 <b style={{ color: "#22c55e" }}>Oferta de Boas-Vindas:</b>
            <br />
            Crie sua conta Google e ganhe{" "}
            <b style={{ color: "#22c55e" }}>10 análises grátis</b> para testar a Betgram IA — sem custo, sem compromisso.
          </div>

          <button
            onClick={handleLogin}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              background: "#fff",
              color: "#000",
              border: "none",
              borderRadius: "50px",
              padding: "12px 24px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              width: "100%",
              transition: "0.3s",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google Logo"
              style={{ width: "22px", height: "22px" }}
            />
            Entrar com Google
          </button>

          <p style={{ marginTop: "25px", fontSize: "0.85rem", color: "#94a3b8" }}>
            🔒 Login 100% seguro com autenticação Google
          </p>
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </main>
    );
  }

  // === PAINEL PRINCIPAL (usuário logado) ===
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0b1324, #111827)",
        color: "#fff",
        fontFamily: "Inter, sans-serif",
        padding: "4vh 20px 8vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          fontSize: "1.9rem",
          fontWeight: 700,
          marginBottom: "30px",
          color: "#22c55e",
          textShadow: "0 0 10px rgba(34,197,94,0.4)",
          letterSpacing: "0.5px",
        }}
      >
        🎯 Betgram IA — Analisador Esportivo
      </h1>

      <div
        style={{
          width: "100%",
          maxWidth: "720px",
          background: "rgba(17,24,39,0.85)",
          border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: "16px",
          boxShadow: "0 0 25px rgba(34,197,94,0.08)",
          padding: "30px",
          backdropFilter: "blur(8px)",
          animation: "fadeIn 0.8s ease",
        }}
      >
        {/* === Cabeçalho do usuário === */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >
          <div>
            <div style={{ fontSize: "1rem" }}>
              👋 Olá, <b>{user?.displayName}</b>
            </div>
            <div
              style={{
                background: "rgba(34,197,94,0.15)",
                border: "1px solid #22c55e55",
                borderRadius: "8px",
                padding: "5px 10px",
                display: "inline-block",
                marginTop: "6px",
                fontWeight: 500,
              }}
            >
              💰 Créditos: {dadosUser?.creditos ?? "?"}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleHistorico}
              style={{
                background: "rgba(14,165,233,0.15)",
                border: "1px solid #0ea5e955",
                borderRadius: "8px",
                padding: "8px 14px",
                color: "#38bdf8",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              📜 Histórico
            </button>
            <button
              onClick={handleLogout}
              style={{
                background: "rgba(239,68,68,0.15)",
                border: "1px solid #ef444455",
                borderRadius: "8px",
                padding: "8px 14px",
                color: "#f87171",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              🚪 Sair
            </button>
          </div>
        </div>

        {/* === Painel principal === */}
        {!mostraHistorico && (
          <div>
            {!panelFlip ? (
              <>
                <label>🏅 Esporte:</label>
                <select style={inputStyle} value={esporte} onChange={(e) => setEsporte(e.target.value)}>
                  <option value="futebol">⚽ Futebol</option>
                  <option value="basquete">🏀 Basquete</option>
                  <option value="tenis">🎾 Tênis</option>
                  <option value="mma">🥊 MMA</option>
                </select>

                <label>🏆 Competição:</label>
                <input
                  style={inputStyle}
                  value={competicao}
                  onChange={(e) => setCompeticao(e.target.value)}
                  placeholder="Ex: Brasileirão, NBA..."
                />

                <label>🎮 Confronto:</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    style={inputStyle}
                    value={timeA}
                    onChange={(e) => setTimeA(e.target.value)}
                    placeholder="Time/Jogador A"
                  />
                  <span style={{ alignSelf: "center", color: "#ccc" }}>X</span>
                  <input
                    style={inputStyle}
                    value={timeB}
                    onChange={(e) => setTimeB(e.target.value)}
                    placeholder="Time/Jogador B"
                  />
                </div>

                <label>🎯 Mercado (opcional):</label>
                <input
                  style={inputStyle}
                  value={mercado}
                  onChange={(e) => setMercado(e.target.value)}
                  placeholder="Ex: Over 2.5, Handicap..."
                />

                {mercado && (
                  <>
                    <label>💰 Odd (opcional):</label>
                    <input
                      style={inputStyle}
                      type="number"
                      value={odd}
                      onChange={(e) => setOdd(e.target.value)}
                      placeholder="Ex: 1.85"
                    />
                  </>
                )}

                <button
                  style={{
                    marginTop: "20px",
                    width: "100%",
                    padding: "12px 0",
                    background: "linear-gradient(90deg,#22c55e,#16a34a)",
                    border: "none",
                    borderRadius: "10px",
                    color: "#fff",
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  onClick={handleAnalise}
                  disabled={carregando}
                >
                  {carregando ? "⏳ Analisando..." : "🚀 Analisar"}
                </button>
              </>
            ) : (
              <>
                <h3 style={{ color: "#22c55e" }}>📊 Resultado da Análise</h3>
                <div
                  className="thin-scroll"
                  style={{
                    background: "rgba(11,19,36,0.7)",
                    border: "1px solid rgba(34,197,94,0.2)",
                    borderRadius: "10px",
                    padding: "15px",
                    maxHeight: "300px",
                    overflowY: "auto",
                    color: "#e5e7eb",
                    marginTop: "10px",
                    lineHeight: "1.5",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: formatAnaliseTexto(resultado),
                  }}
                />
                <button
                  style={{
                    marginTop: "20px",
                    background: "rgba(14,165,233,0.2)",
                    border: "1px solid #0ea5e955",
                    color: "#38bdf8",
                    borderRadius: "8px",
                    padding: "10px 16px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  onClick={() => setPanelFlip(false)}
                >
                  ↩ Voltar
                </button>
              </>
            )}
          </div>
        )}

        {/* === Histórico === */}
        {mostraHistorico && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h3 style={{ color: "#22c55e", margin: 0 }}>📜 Últimas análises</h3>
              <button
                style={{
                  background: "rgba(239,68,68,0.15)",
                  border: "1px solid #ef444455",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  color: "#f87171",
                  cursor: "pointer",
                }}
                onClick={() => setMostraHistorico(false)}
              >
                ❌ Fechar
              </button>
            </div>

            <div
              className="thin-scroll"
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                background: "rgba(11,19,36,0.6)",
                border: "1px solid rgba(34,197,94,0.15)",
                borderRadius: "10px",
                padding: "15px",
              }}
            >
              {historico.map((h, i) => (
                <div key={i} style={{ borderBottom: "1px dashed rgba(255,255,255,0.1)", marginBottom: "12px", paddingBottom: "8px" }}>
                  <b style={{ color: "#22c55e" }}>{h.confronto}</b> —{" "}
                  <span style={{ color: "#0ea5e9" }}>{h.mercado || "Análise completa"}</span>
                  <br />
                  <small style={{ color: "#aaa" }}>{new Date(h.timestamp).toLocaleString("pt-BR")}</small>
                  {h.resposta && (
                    <div
                      style={{
                        color: "#e5e7eb",
                        background: "rgba(17,24,39,0.6)",
                        borderRadius: "8px",
                        padding: "8px 10px",
                        marginTop: "8px",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: formatAnaliseTexto(h.resposta),
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
