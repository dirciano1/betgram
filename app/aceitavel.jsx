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
      <main style={styles.container}>
        <div style={styles.mainArea}>
          <div style={styles.box}>
            <h2 style={{ marginTop: 0 }}>
              🤖 Bem-vindo ao{" "}
              <span style={{ color: "#22c55e" }}>Betgram IA</span>
            </h2>
            <p>
              Gere análises inteligentes e descubra as melhores apostas em
              segundos.
            </p>
            <div style={{ margin: "15px 0", color: "#ccc" }}>
              🎁 Crie sua conta Google e ganhe{" "}
              <b style={{ color: "#22c55e" }}>10 análises grátis!</b>
            </div>
            <button style={styles.botaoLogin} onClick={handleLogin}>
              🚀 Entrar com Google
            </button>
          </div>
        </div>
      </main>
    );
  }

  // === PAINEL PRINCIPAL (usuário logado) ===
  return (
    <main style={styles.container}>
      <h1 style={styles.titulo}>🎯 Betgram IA - Analisador Esportivo</h1>

      <div style={styles.mainArea}>
        {!mostraHistorico && (
          <div style={styles.panelFlipContainer}>
            <div style={styles.userBox}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span>👋 Olá, {user?.displayName}</span>
                <div style={styles.creditosBox}>💰 Créditos: {dadosUser?.creditos ?? "?"}</div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={handleHistorico} style={styles.botaoHistorico}>📜 Histórico</button>
                <button onClick={handleLogout} style={styles.botaoSair}>🚪 Sair</button>
              </div>
            </div>

            <div style={styles.box}>
              {!panelFlip ? (
                <>
                  <label>🏅 Esporte:</label>
                  <select style={styles.input} value={esporte} onChange={(e) => setEsporte(e.target.value)}>
                    <option value="futebol">⚽ Futebol</option>
                    <option value="basquete">🏀 Basquete</option>
                    <option value="tenis">🎾 Tênis</option>
                    <option value="mma">🥊 MMA</option>
                  </select>

                  <label>🏆 Competição:</label>
                  <input style={styles.input} value={competicao} onChange={(e) => setCompeticao(e.target.value)} placeholder="Ex: Brasileirão, NBA..." />

                  <label>🎮 Confronto:</label>
                  <div style={{ display: "flex", gap: 10 }}>
                    <input style={styles.input} value={timeA} onChange={(e) => setTimeA(e.target.value)} placeholder="Time/Jogador A" />
                    <span style={{ color: "#fff", alignSelf: "center" }}>X</span>
                    <input style={styles.input} value={timeB} onChange={(e) => setTimeB(e.target.value)} placeholder="Time/Jogador B" />
                  </div>

                  <label>🎯 Mercado (opcional):</label>
                  <input style={styles.input} value={mercado} onChange={(e) => setMercado(e.target.value)} placeholder="Ex: Over 2.5, Handicap..." />
                  {mercado && (
                    <>
                      <label>💰 Odd (opcional):</label>
                      <input style={styles.input} type="number" value={odd} onChange={(e) => setOdd(e.target.value)} placeholder="Ex: 1.85" />
                    </>
                  )}

                  <button style={styles.botao} onClick={handleAnalise} disabled={carregando}>
                    {carregando ? "Analisando..." : "Analisar 🚀"}
                  </button>
                </>
              ) : (
                <>
                  <h3>📊 Resultado da Análise</h3>
                  <div
                    className="thin-scroll"
                    style={styles.resultadoBox}
                    dangerouslySetInnerHTML={{ __html: formatAnaliseTexto(resultado) }}
                  />
                  <button style={styles.botaoVoltar} onClick={() => setPanelFlip(false)}>↩ Voltar</button>
                </>
              )}
            </div>
          </div>
        )}

        {mostraHistorico && (
          <div style={styles.historicoBox}>
            <div style={styles.historicoHeader}>
              <h3 style={{ margin: 0 }}>📜 Últimas análises</h3>
              <button style={styles.botaoFechar} onClick={() => setMostraHistorico(false)}>❌ Fechar</button>
            </div>
            <div className="thin-scroll" style={styles.scrollArea}>
              {historico.map((h, i) => (
                <div key={i} style={styles.historicoItem}>
                  <b style={{ color: "#22c55e" }}>{h.confronto}</b> —{" "}
                  <span style={{ color: "#0ea5e9" }}>{h.mercado || "Análise completa"}</span>
                  <br />
                  <small style={{ color: "#aaa" }}>{new Date(h.timestamp).toLocaleString("pt-BR")}</small>
                  {h.resposta && (
                    <div
                      style={styles.historicoResposta}
                      dangerouslySetInnerHTML={{ __html: formatAnaliseTexto(h.resposta) }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

/* === ESTILOS === */
const styles = {
  container: { background: "#0b1324", color: "#fff", fontFamily: '"Poppins", sans-serif', minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", padding: "20px" },
  mainArea: { width: "100%", maxWidth: "700px" },
  box: { background: "rgba(255,255,255,0.05)", border: "2px solid #22c55e", borderRadius: "16px", padding: "20px", overflow: "hidden" },
  botaoLogin: { background: "#22c55e", border: "none", color: "#0b1324", padding: "14px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "1em", width: "100%", marginTop: "10px" },
  titulo: { color: "#22c55e", fontWeight: 700, fontSize: "1.8em", marginBottom: "10px", textAlign: "center" },
  userBox: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.05)", border: "2px solid #22c55e", borderRadius: "12px", padding: "10px 20px", marginBottom: "20px" },
  creditosBox: { background: "#22c55e", color: "#0b1324", padding: "2px 10px", borderRadius: "8px", fontWeight: "600" },
  botaoHistorico: { background: "#0ea5e9", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", fontWeight: "600" },
  botaoSair: { background: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", fontWeight: "600" },
  input: { width: "100%", padding: "10px", borderRadius: "10px", background: "#111827", color: "#fff", border: "1px solid #333", marginBottom: "10px" },
  botao: { width: "100%", padding: "14px", background: "#22c55e", color: "#0b1324", fontWeight: "bold", border: "none", borderRadius: "10px", cursor: "pointer" },
  botaoVoltar: { marginTop: "10px", background: "#0ea5e9", border: "none", color: "#fff", padding: "10px 20px", borderRadius: "10px", cursor: "pointer" },
  resultadoBox: { background: "#0f172a", padding: "16px 18px", borderRadius: "10px", borderLeft: "4px solid #22c55e", color: "#e2e8f0", fontFamily: "'Fira Code', monospace", fontSize: "14px", lineHeight: "1.5em", whiteSpace: "pre-wrap", overflowY: "auto", maxHeight: "320px" },
  historicoBox: { background: "rgba(255,255,255,0.05)", border: "2px solid #22c55e", borderRadius: "16px", padding: "20px", overflow: "hidden" },
  historicoHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  botaoFechar: { background: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontWeight: "600" },
  scrollArea: { maxHeight: "340px", overflowY: "auto", paddingRight: "6px" },
  historicoItem: { borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "8px 0" },
  historicoResposta: { background: "#0f172a", padding: "12px 14px", borderRadius: "10px", marginTop: "10px", borderLeft: "4px solid #22c55e", color: "#e2e8f0", fontFamily: "'Fira Code', monospace", whiteSpace: "pre-wrap", lineHeight: "1.5em", fontSize: "14px", overflow: "hidden" },
};
