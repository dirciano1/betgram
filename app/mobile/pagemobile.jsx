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
} from "../../lib/firebase";
import { gerarAnalise } from "../../lib/aiClient";
import "../globals.css";

/* === ESTILO BASE DOS INPUTS === */
const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(17,24,39,0.8)",
  color: "#fff",
  marginBottom: "14px",
  outline: "none",
  transition: "0.2s",
  fontSize: "1rem",
};

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
  const [mostraCreditos, setMostraCreditos] = useState(false);

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
    setMostraCreditos(false);
  }

  async function handleAnalise() {
    if (!user) return alert("⚠️ Faça login primeiro.");
    if (!timeA || !timeB) return alert("Preencha os dois times.");

    setCarregando(true);
    const confronto = `${timeA} x ${timeB}`;
    const modulo = await import(`../../prompts/${esporte}.js`);
    const prompt = modulo.gerarPrompt(confronto, mercado, competicao, odd);

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    const dados = snap.data();

    if ((dados?.creditos ?? 0) <= 0) {
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

    await updateDoc(ref, { creditos: (dados.creditos ?? 0) - 1 });
    setDadosUser({ ...dados, creditos: (dados.creditos ?? 0) - 1 });
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
      .replace(/\n/g, "<br>");
  }

  // === SEM LOGIN ===
  if (!user) {
    return (
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #0b1324, #111827)",
          color: "#fff",
          fontFamily: "Inter, sans-serif",
          padding: "20px",
        }}
      >
        <div
          style={{
            background: "rgba(17,24,39,0.85)",
            border: "2px solid #22c55e55",
            borderRadius: "16px",
            padding: "40px 30px",
            width: "90%",
            maxWidth: "400px",
            textAlign: "center",
            boxShadow: "0 0 25px rgba(34,197,94,0.15)",
          }}
        >
          <h2 style={{ fontSize: "1.8rem", fontWeight: 700 }}>
            🤖 Bem-vindo ao <span style={{ color: "#22c55e" }}>Betgram IA</span>
          </h2>
          <p style={{ color: "#ccc" }}>Gere análises inteligentes e descubra as melhores apostas em segundos.</p>
          <div
            style={{
              background: "linear-gradient(90deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05))",
              border: "1px solid #22c55e55",
              borderRadius: "12px",
              padding: "15px 20px",
              color: "#a7f3d0",
              margin: "20px 0",
            }}
          >
            🎁 <b style={{ color: "#22c55e" }}>Ganhe 10 análises grátis</b> ao criar sua conta Google.
          </div>
          <button
            onClick={handleLogin}
            style={{
              background: "#fff",
              color: "#000",
              border: "none",
              borderRadius: "50px",
              padding: "12px 24px",
              fontWeight: "600",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Entrar com Google
          </button>
        </div>
      </main>
    );
  }

  // === LOGADO ===
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
      <h1 style={{ fontSize: "1.9rem", fontWeight: 700, marginBottom: "30px", color: "#22c55e", textAlign: "center" }}>
        🎯 Betgram IA — Analisador Esportivo
      </h1>

      <div
        style={{
          width: "95%",
          maxWidth: "700px",
          background: "rgba(17,24,39,0.85)",
          border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: "16px",
          boxShadow: "0 0 25px rgba(34,197,94,0.08)",
          padding: "28px",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* === Usuário === */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px", flexWrap: "wrap" }}>
          <div>
            👋 Olá, <b>{user?.displayName}</b>
            <div
              style={{
                background: "rgba(34,197,94,0.15)",
                border: "1px solid #22c55e55",
                borderRadius: "8px",
                padding: "5px 10px",
                marginTop: "6px",
                display: "inline-block",
              }}
            >
              💰 Créditos: {dadosUser?.creditos ?? "?"}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
            <button
              onClick={() => setMostraCreditos(true)}
              style={{
                background: "rgba(34,197,94,0.15)",
                border: "1px solid #22c55e55",
                borderRadius: "8px",
                padding: "8px 14px",
                color: "#22c55e",
                fontWeight: 600,
              }}
            >
              ➕ Créditos
            </button>
            <button
              onClick={handleHistorico}
              style={{
                background: "rgba(14,165,233,0.15)",
                border: "1px solid #0ea5e955",
                borderRadius: "8px",
                padding: "8px 14px",
                color: "#38bdf8",
                fontWeight: 600,
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
              }}
            >
              🚪 Sair
            </button>
          </div>
        </div>

        {/* === Corpo === */}
        {!mostraHistorico && !mostraCreditos && (
          <>
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
                <input style={inputStyle} value={competicao} onChange={(e) => setCompeticao(e.target.value)} placeholder="Ex: Brasileirão, NBA..." />

                <label>🎮 Confronto:</label>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <input style={inputStyle} value={timeA} onChange={(e) => setTimeA(e.target.value)} placeholder="Time / Jogador A" />
                  <input style={inputStyle} value={timeB} onChange={(e) => setTimeB(e.target.value)} placeholder="Time / Jogador B" />
                </div>

                <label>🎯 Mercado (opcional):</label>
                <input style={inputStyle} value={mercado} onChange={(e) => setMercado(e.target.value)} placeholder="Ex: Over 2.5, Handicap..." />

                {mercado && (
                  <>
                    <label>💰 Odd (opcional):</label>
                    <input type="number" style={inputStyle} value={odd} onChange={(e) => setOdd(e.target.value)} placeholder="Ex: 1.85" />
                  </>
                )}

                <button
                  onClick={handleAnalise}
                  disabled={carregando}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "10px",
                    background: "linear-gradient(90deg,#22c55e,#16a34a)",
                    border: "none",
                    color: "#fff",
                    fontWeight: "600",
                    fontSize: "1rem",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                >
                  {carregando ? "⏳ Analisando..." : "🚀 Analisar"}
                </button>
              </>
            ) : (
              <>
                <h3 style={{ color: "#22c55e" }}>📊 Resultado da Análise</h3>
                <div
                  style={{
                    background: "rgba(11,19,36,0.7)",
                    border: "1px solid rgba(34,197,94,0.2)",
                    borderRadius: "10px",
                    padding: "15px",
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}
                  dangerouslySetInnerHTML={{ __html: formatAnaliseTexto(resultado) }}
                />
                <button
                  onClick={() => setPanelFlip(false)}
                  style={{
                    marginTop: "20px",
                    background: "rgba(14,165,233,0.2)",
                    border: "1px solid #0ea5e955",
                    color: "#38bdf8",
                    borderRadius: "8px",
                    padding: "10px 16px",
                    fontWeight: 600,
                  }}
                >
                  ↩ Voltar
                </button>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
