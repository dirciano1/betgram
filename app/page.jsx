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

const inputStyle = {
  width: "100%",
  padding: "8px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(17,24,39,0.8)",
  color: "#fff",
  marginBottom: "14px",
  outline: "none",
  transition: "0.2s",
  fontSize: "1rem",
};

// Novo estilo para o modal
const modalBackdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0, 0, 0, 0.7)",
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
  flex: 1,
  minWidth: "120px",
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
  flex: 1,
  minWidth: "120px",
};

// Componente Modal de Confirmação
function ConfirmacaoModal({
  show,
  onConfirm,
  onCancel,
  timeA,
  timeB,
  creditos,
}) {
  if (!show) return null;

  return (
    <div style={modalBackdropStyle}>
      <div style={modalContentStyle}>
        <h3 style={{ color: "#22c55e", marginBottom: "15px" }}>
          Confirmar Análise 🤖
        </h3>
        <p style={{ color: "#ccc", marginBottom: "20px" }}>
          Você está prestes a gerar a análise para:
          <br />
          <b style={{ color: "#38bdf8" }}>{timeA} x {timeB}</b>
        </p>
        <div
          style={{
            background: "rgba(251,191,36,0.1)",
            border: "1px solid #facc1555",
            borderRadius: "8px",
            padding: "10px",
            marginBottom: "20px",
            color: "#facc15",
            fontWeight: 600,
          }}
        >
          ⚠️ Esta ação consumirá <b style={{ color: "#fff" }}>1 crédito</b>. O
          crédito <b style={{ color: "#fff" }}>NÃO É REEMBOLSÁVEL</b>.
        </div>
        <p style={{ color: "#fff", marginBottom: "20px" }}>
          Seus créditos restantes: <b>{creditos - 1}</b>
        </p>

        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button onClick={onCancel} style={buttonCancelStyle}>
            ❌ Cancelar
          </button>
          <button onClick={onConfirm} style={buttonConfirmStyle}>
            ✅ Continuar
          </button>
        </div>
      </div>
    </div>
  );
}

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
  // NOVOS ESTADOS PARA O MODAL
  const [showConfirmacaoModal, setShowConfirmacaoModal] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        await carregarDadosUsuario(u);
      } else setUser(null);
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
    } else setDadosUser(snap.data());
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

  // --- FUNÇÃO DE LÓGICA PRINCIPAL (SEPARADA DA CONFIRMAÇÃO) ---
  async function gerarESalvarAnalise() {
    setShowConfirmacaoModal(false); // Fecha o modal
    setCarregando(true);

    try {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      const dados = snap.data();

      // Dupla checagem de créditos antes de prosseguir
      if (dados.creditos <= 0) {
        alert("❌ Você não tem créditos suficientes.");
        return;
      }

      const confronto = `${timeA} x ${timeB}`;
      const modulo = await import(`../prompts/${esporte}.js`);
      const prompt = modulo.gerarPrompt(confronto, mercado, competicao, odd);

      const resposta = await gerarAnalise(prompt);

      // 1. Salva a análise
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

      // 2. Decrementa o crédito
      await updateDoc(ref, { creditos: dados.creditos - 1 });
      setDadosUser({ ...dados, creditos: dados.creditos - 1 });

      // 3. Mostra o resultado
      setResultado(resposta);
      setPanelFlip(true);
    } catch (error) {
      alert("Ocorreu um erro ao gerar a análise. Tente novamente mais tarde.");
      console.error("Erro na análise:", error);
    } finally {
      setCarregando(false);
    }
  }
  // --- FIM DA FUNÇÃO DE LÓGICA PRINCIPAL ---

  /**
   * Função alterada para MOSTRAR O MODAL em vez de window.confirm.
   */
  async function handleAnalise() {
    if (!user) return alert("⚠️ Faça login primeiro.");
    if (!timeA || !timeB) return alert("Preencha os dois times.");

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    const dados = snap.data();

    if (dados.creditos <= 0) {
      alert("❌ Você não tem créditos suficientes.");
      return;
    }

    // Mostra o modal de confirmação
    setShowConfirmacaoModal(true);
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
      .replace(
        /(Mercado|Mercados)/gi,
        '<span style="color:#38bdf8;font-weight:600;">$1</span>'
      )
      .replace(
        /(Odd[s]?:?\s*\d+(\.\d+)?)/gi,
        '<span style="color:#facc15;font-weight:600;">$1</span>'
      )
      .replace(
        /(Recomendação|Aposta|Sugestão|Valor)/gi,
        '<span style="color:#22c55e;font-weight:600;">$1</span>'
      )
      .replace(
        /(Justificativa|Análise|Contexto|Resumo)/gi,
        '<span style="color:#fb923c;font-weight:600;">$1</span>'
      )
      .replace(/###\s*(.*)/g, '<br><strong style="color:#0ea5e9;">📘 $1</strong>')
      .replace(/\n/g, "<br>");
  }

  if (!user) {
    return (
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #0b1324 0%, #111827 100%)",
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
          <h2 style={{display: "flex",alignItems: "center",gap: "8px",justifyContent: "center",fontSize: "1.6rem",}}>
        <img src="/icon.png" alt="Logo BetGram" style={{ width: "36px", height: "36px", objectFit: "contain" }} />
        <span style={{ color: "#ffffff" }}> Bem-vindo à<span style={{ color: "#22c55e" }}> BetGram</span></span>
        </h2>
          <p style={{ color: "#ccc" }}>
            Gere análises inteligentes e descubra as melhores apostas esportivas em segundos.
          </p>
          <div
            style={{
              background:
                "linear-gradient(90deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05))",
              border: "1px solid #22c55e55",
              borderRadius: "12px",
              padding: "10px 20px",
              color: "#a7f3d0",
              margin: "20px 0",
            }}
          >
            🎁 <b style={{ color: "#22c55e" }}>Ganhe 10 Análises grátis</b> ao
            Criar Sua Conta
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
              padding: "14px 28px",
              fontWeight: "600",
              cursor: "pointer",
              width: "100%",
            }}
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google Logo"
              style={{ width: "22px", height: "22px" }}
            />
            Entrar com Google
          </button>
        </div>
      </main>
    );
  }

  const primeiroNome = user?.displayName?.split(" ")[0] || "Usuário";
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
      <h2 style={{display: "flex",alignItems: "center",gap: "8px",justifyContent: "center",fontSize: "1.6rem",}}>
  <img src="/icon.png" alt="Logo BetGram" style={{ width: "36px", height: "36px", objectFit: "contain" }} />
  <span style={{ color: "#22c55e" }}> BetGram -<span style={{ color: "#fff" }}> Analisador Esportivo</span></span>
     </h2>

      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          background: "rgba(17,24,39,0.85)",
          border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: "16px",
          boxShadow: "0 0 25px rgba(34,197,94,0.08)",
          padding: "10px",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* === CABEÇALHO === */}
        <div style={{ marginBottom: "25px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
              flexWrap: "nowrap",
            }}
          >
            <div style={{ fontSize: "1.1rem" }}>
              👋 Olá, <b>{primeiroNome}</b>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(17,24,39,0.6)",
                borderRadius: "8px",
                padding: "4px 10px",
                border: "1px solid rgba(34,197,94,0.3)",
                boxShadow: "0 0 8px rgba(34,197,94,0.2)",
                flexShrink: 0,
              }}
            >
              💰{" "}
              <span
                style={{
                  color: "#22c55e",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                {dadosUser?.creditos ?? "0"}
              </span>
            </div>
          </div>

          {/* Botão Sair */}
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
              marginTop: "10px",
              width: "100%",
            }}
          >
            🚪 Sair
          </button>

          {/* Botões abaixo */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "12px",
              justifyContent: "center",
            }}
          >
            <button
              onClick={handleHistorico}
              style={{
                flex: "1 1 48%",
                minWidth: "140px",
                background: "rgba(14,165,233,0.15)",
                border: "1px solid #0ea5e955",
                borderRadius: "8px",
                padding: "8px",
                color: "#38bdf8",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              🕓 Histórico
            </button>

            <button
              onClick={() => setMostraCreditos(true)}
              style={{
                flex: "1 1 48%",
                minWidth: "140px",
                background: "rgba(34,197,94,0.15)",
                border: "1px solid #22c55e55",
                borderRadius: "8px",
                padding: "8px",
                color: "#22c55e",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              💳 Créditos
            </button>
          </div>
        </div>

        {/* === CONTEÚDO PRINCIPAL === */}
        {!mostraHistorico && !mostraCreditos && (
          <>
            {!panelFlip ? (
              <>
                <label>🏅 Esporte:</label>
                <select
                  style={inputStyle}
                  value={esporte}
                  onChange={(e) => setEsporte(e.target.value)}
                >
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
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "column",
                  }}
                >
                  <input
                    style={inputStyle}
                    value={timeA}
                    onChange={(e) => setTimeA(e.target.value)}
                    placeholder="Time/Jogador A"
                  />
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
                  onClick={handleAnalise}
                  disabled={carregando}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "12px",
                    background: "linear-gradient(90deg,#22c55e,#16a34a)",
                    border: "none",
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "1.2rem",
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
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(34,197,94,0.4) transparent",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: formatAnaliseTexto(resultado),
                  }}
                />
                <button
                  onClick={() => setPanelFlip(false)}
                  style={{
                    marginTop: "20px",
                    background: "rgba(14,165,233,0.2)",
                    border: "1px solid #0ea5e955",
                    color: "#38bdf8",
                    borderRadius: "8px",
                    padding: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  ↩ Voltar
                </button>
              </>
            )}
          </>
        )}

        {/* === HISTÓRICO === */}
        {mostraHistorico && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <h3 style={{ color: "#22c55e", margin: 0 }}>
                📜 Últimas análises
              </h3>
              <button
                onClick={() => setMostraHistorico(false)}
                style={{
                  background: "rgba(239,68,68,0.15)",
                  border: "1px solid #ef444455",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  color: "#f87171",
                }}
              >
                ❌ Fechar
              </button>
            </div>

            <div
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                background: "rgba(11,19,36,0.6)",
                borderRadius: "10px",
                padding: "15px",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(34,197,94,0.4) transparent",
              }}
            >
              {historico.map((h, i) => (
                <div
                  key={i}
                  style={{
                    borderBottom: "1px dashed rgba(255,255,255,0.1)",
                    marginBottom: "14px",
                    paddingBottom: "10px",
                    background: "rgba(17,24,39,0.4)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <b style={{ color: "#22c55e" }}>{h.confronto}</b>{" "}
                      <span style={{ color: "#0ea5e9" }}>
                        {h.mercado || "Análise completa"}
                      </span>
                    </div>
                    <small style={{ color: "#94a3b8" }}>
                      {new Date(h.timestamp).toLocaleString("pt-BR")}
                    </small>
                  </div>

                  {h.resposta && (
                    <div
                      style={{
                        marginTop: "10px",
                        background: "rgba(11,19,36,0.75)",
                        border: "1px solid rgba(34,197,94,0.2)",
                        borderRadius: "8px",
                        padding: "10px 12px",
                        color: "#e5e7eb",
                        fontSize: "0.95rem",
                        lineHeight: "1.5",
                        maxHeight: "200px",
                        overflowY: "auto",
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(34,197,94,0.4) transparent",
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

        {/* === CRÉDITOS === */}
        {mostraCreditos && (
          <div>
            <h3 style={{ color: "#22c55e" }}>💳 Adicionar Créditos</h3>
            <p style={{ color: "#ccc", marginBottom: "16px" }}>
              Entre em contato no WhatsApp para adicionar créditos à sua conta.
            </p>

            <a
              href="https://wa.me/5599999999999?text=Olá,+quero+adicionar+créditos+na+Betgram+IA!"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background:
                  "linear-gradient(90deg,rgba(37,211,102,0.9),rgba(16,185,129,0.9))",
                color: "#fff",
                fontWeight: 600,
                borderRadius: "10px",
                padding: "14px 20px",
                textDecoration: "none",
                marginBottom: "20px",
              }}
            >
              💬 Falar no WhatsApp
            </a>

            <button
              onClick={() => setMostraCreditos(false)}
              style={{
                background: "rgba(14,165,233,0.2)",
                border: "1px solid #0ea5e955",
                borderRadius: "8px",
                padding: "10px 14px",
                color: "#38bdf8",
                fontWeight: 600,
                cursor: "pointer",
                width: "100%",
              }}
            >
              ↩ Voltar
            </button>
          </div>
        )}
      </div>

      {/* RENDERIZAÇÃO DO MODAL DE CONFIRMAÇÃO */}
      <ConfirmacaoModal
        show={showConfirmacaoModal}
        onConfirm={gerarESalvarAnalise}
        onCancel={() => setShowConfirmacaoModal(false)}
        timeA={timeA}
        timeB={timeB}
        creditos={dadosUser?.creditos ?? 0}
      />
    </main>
  );
}



