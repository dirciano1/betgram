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
  serverTimestamp,
} from "../lib/firebase";
import { gerarAnalise } from "../lib/aiClient";
import "./globals.css";

import BetgramPayModal from "./components/BetgramPayModal";
import { capturarIndicadorURL } from "../lib/utils";

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

function ConfirmacaoModal({ show, onConfirm, onCancel, timeA, timeB, creditos }) {
  if (!show) return null;
  return (
    <div style={modalBackdropStyle}>
      <div style={modalContentStyle}>
        <h3 style={{ color: "#22c55e", marginBottom: "15px" }}>Confirmar Análise </h3>
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
          ⚠️ Esta ação consumirá <b style={{ color: "#fff" }}>1 crédito</b>. O crédito{" "}
          <b style={{ color: "#fff" }}>NÃO É REEMBOLSÁVEL</b>.
        </div>
        <p style={{ color: "#fff", marginBottom: "20px" }}>
          Seus créditos restantes: <b>{creditos - 1}</b>
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button onClick={onCancel} style={buttonCancelStyle}>❌ Cancelar</button>
          <button onClick={onConfirm} style={buttonConfirmStyle}>✅ Continuar</button>
        </div>
      </div>
    </div>
  );
}
// =========================================
// SELECT CUSTOMIZADO (ESTILIZADO 100% DARK)
// =========================================
function SelectEsporte({ value, onChange }) {
  const [open, setOpen] = useState(false);

  const esportes = [
    { value: "futebol", label: "⚽ Futebol" },
    { value: "basquete", label: "🏀 Basquete" },
    { value: "tenis", label: "🎾 Tênis" },
    { value: "volei", label: "🏐 Vôlei" },
    { value: "mma", label: "🥊 MMA / UFC" },
    { value: "boxe", label: "🥊 Boxe" },
    { value: "eSports", label: "🎮 eSports (CS2, LoL, Valorant...)" },
    { value: "handebol", label: "🤾 Handebol" },
    { value: "futsal", label: "⚽ Futsal" },
    { value: "beisebol", label: "⚾ Beisebol" },
    { value: "rugby", label: "🏉 Rugby" },
    { value: "hoquei", label: "🏒 Hóquei no Gelo" },
    { value: "corrida", label: "🏎️ Fórmula 1" },
    { value: "ciclismo", label: "🚴 Ciclismo" },
    { value: "golfe", label: "🏌️ Golfe" },
    { value: "criquete", label: "🏏 Críquete" },
    { value: "snooker", label: "🎱 Snooker / Bilhar" },
    { value: "dardos", label: "🎯 Dardos" },
    { value: "politica", label: "🏛️ Política" },
    { value: "entretenimento", label: "🎬 Entretenimento" },
    { value: "cartola", label: "🎩 Cartola FC" },
  ];

  return (
    <div className="select-custom">
      <div className="select-display" onClick={() => setOpen(!open)}>
        {esportes.find(e => e.value === value)?.label}
        <span className="select-arrow">▼</span>
      </div>

      {open && (
        <ul className="select-options">
          {esportes.map(item => (
            <li
              key={item.value}
              className={item.value === value ? "selected" : ""}
              onClick={() => {
                onChange(item.value);
                setOpen(false);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [dadosUser, setDadosUser] = useState(null);
  const [esporte, setEsporte] = useState("futebol");
  const [competicao, setCompeticao] = useState("");
  const [anoCompeticao, setAnoCompeticao] = useState("2025");
  const [timeA, setTimeA] = useState("");
  const [timeB, setTimeB] = useState("");
  const [mercado, setMercado] = useState("");
  const [odd, setOdd] = useState("");
  const [resultado, setResultado] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [carregandoFrase, setCarregandoFrase] = useState("Analisando...");
  const [panelFlip, setPanelFlip] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [mostraHistorico, setMostraHistorico] = useState(false);
  const [showBetgramPayModal, setShowBetgramPayModal] = useState(false);
  const [showConfirmacaoModal, setShowConfirmacaoModal] = useState(false);

  useEffect(() => {
    capturarIndicadorURL();
  }, []);

  async function handleClosePayModal() {
    setShowBetgramPayModal(false);
    if (user) await carregarDadosUsuario(user);
  }
  
   useEffect(() => {
  const normal = document.getElementById("area-normal");
  const cartola = document.getElementById("area-cartola");

  if (!normal || !cartola) return;

  if (esporte === "cartola") {
    normal.style.display = "none";
    cartola.style.display = "block";
  } else {
    normal.style.display = "block";
    cartola.style.display = "none";
  }
}, [esporte]);

  useEffect(() => {
  if (!carregando) return;

  const frases = [
    "Analisando banco de dados…",
    "Cruzando informações estatísticas…",
    "Calculando probabilidades…",
    "Avaliando desempenho recente…",
    "Gerando previsão de valor…",
    "Estimando odd justa…",
    "Processando padrões do confronto…",
    "Refinando o cálculo final…",
    "Tudo pronto! Estamos finalizando a análise…",
    "A Analise Completa já será entregue…"
  ];

  let i = 0;

  const intervalo = setInterval(() => {
    setCarregandoFrase(frases[i]);

    // 👉 quando chegar no final, para o loop automático
    if (i === frases.length - 1) {
      clearInterval(intervalo);
      return;
    }

    i++;
  }, 5000); // tempo entre cada frase

  return () => clearInterval(intervalo);
}, [carregando]);

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
      const indicadoPor = localStorage.getItem("indicadoPor");
      await setDoc(ref, {
        uid: u.uid,
        nome: u.displayName || "Usuário",
        email: u.email || "",
        creditos: 10,
        role: "user",
        indicadoPor: indicadoPor || null,
        bonusRecebido: false,
        jaComprou: false,
        criadoEm: serverTimestamp(),
      });
      if (indicadoPor) {
        await addDoc(collection(db, "indicacoes"), {
          indicadoPor: indicadoPor,
          indicado: u.uid,
          data: serverTimestamp(),
          bonusPago: false,
        });
      }
      setDadosUser({ nome: u.displayName, creditos: 10 });
    } else setDadosUser(snap.data());
  }
  async function handleLogin() {
  try {
    const u = await loginComGoogle();
    setUser(u);

    // Carrega dados no Firestore
    await carregarDadosUsuario(u);

    // Lê os dados atualizados do usuário
    const userDoc = await getDoc(doc(db, "users", u.uid));
    const role = userDoc.data().role || "user";

    // SALVA UID E ROLE
    document.cookie = `uid=${u.uid}; path=/;`;
    document.cookie = `role=${role}; path=/;`;

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

  async function gerarESalvarAnalise() {
    setShowConfirmacaoModal(false);
    setCarregando(true);
    try {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      const dados = snap.data();
      if (dados.creditos <= 0) return alert("❌ Você não tem créditos suficientes.");

      const confronto = `${timeA} x ${timeB}`;
      const modulo = await import(`../prompts/${esporte}.js`);

let prompt;

// 🎩 MODO CARTOLA — COM JOGADORES REAIS
if (esporte === "cartola") {

  // coleta inputs
  const tipo = document.getElementById("cartola-tipo")?.value || "defesa";
  const orcamento = document.getElementById("cartola-orcamento")?.value || "";
  const posicao = document.getElementById("cartola-posicao")?.value || "";
  const rodada = "";

  // busca dados REAIS pela sua própria API (sem CORS)
  const apiCartola = await fetch("/api/cartola").then(r => r.json());

  // reduz o payload para evitar custo no Gemini
  const jogadores = apiCartola.atletas.map(a => ({
    nome: a.apelido,
    posicao: a.posicao_id,
    clube: a.clube_id,
    preco: a.preco_num,
    media: a.media_num
  }));

  // monta prompt com jogadores reais
  switch (tipo) {
    case "defesa":
      prompt = modulo.gerarPromptDefesa(orcamento, posicao, rodada, jogadores);
      break;

    case "meio":
      prompt = modulo.gerarPromptMeio(orcamento, posicao, rodada, jogadores);
      break;

    case "ataque":
      prompt = modulo.gerarPromptAtaque(orcamento, posicao, rodada, jogadores);
      break;

    case "tecnico":
      prompt = modulo.gerarPromptTecnico(orcamento, posicao, rodada, jogadores);
      break;

    default:
      prompt = "Erro: tipo inválido no prompt Cartola.";
  }
}


// ⚽ MODO ESPORTE NORMAL (Betgram padrão)
} else {
  prompt = modulo.gerarPrompt(confronto, mercado, competicao, odd);
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
      setPanelFlip(true);
    } catch (e) {
      alert("Erro ao gerar análise.");
      console.error(e);
    } finally {
      setCarregando(false);
    }
  }

  async function handleAnalise() {
  if (!user) return alert("⚠️ Faça login primeiro.");

  // 👉 Se for modo CARTOLA, NÃO verificar timeA e timeB
  if (esporte !== "cartola") {
    if (!timeA || !timeB) {
      return alert("Preencha os dois times.");
    }
  }

  const snap = await getDoc(doc(db, "users", user.uid));
  const dados = snap.data();
  if (dados.creditos <= 0) return alert("❌ Créditos insuficientes.");

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
    setHistorico(snap.docs.map((d) => d.data()));
    setMostraHistorico(true);
  }

  function formatAnaliseTexto(texto = "") {
  return texto

    // === Cabeçalhos ===
    .replace(/🏟️([^<\n]+)/g,
      '<span style="color:#22c55e;font-weight:700;">🏟️$1</span>'
    )

    // === Nomes dos TIMES (qualquer nome entre ** ** vira verde neon) ===
    // Ex: **Arsenal** -> Arsenal em verde
    .replace(/\*\*(.*?)\*\*/g,
      '<span style="color:#22c55e;font-weight:700;">$1</span>'
    )

    // === Médias ===
    .replace(/⚽\s*Médias:/g,
      '<span style="color:#38bdf8;font-weight:700;">⚽ Médias:</span>'
    )

    // === Média Combinada ===
    .replace(/🧮\s*Média combinada:/gi,
      '<span style="color:#38bdf8;font-weight:700;">🧮 Média combinada:</span>'
    )

    // === Probabilidades ===
    .replace(/📊\s*Probabilidades?:?/gi,
      '<span style="color:#facc15;font-weight:700;">📊 Probabilidades:</span>'
    )

    // === Odds Justas ===
    .replace(/💰\s*Odd[s ]?Justa[s]?:?/gi,
      '<span style="color:#fb923c;font-weight:700;">💰 Odds Justas:</span>'
    )

    // === Valor Esperado (EV) ===
    .replace(/Valor esperado \(EV\):/gi,
      '<span style="color:#34d399;font-weight:700;">Valor esperado (EV):</span>'
    )

    // === Conclusão ===
    .replace(/🔎\s*Conclusão:/gi,
      '<span style="color:#22c55e;font-weight:700;">🔎 Conclusão:</span>'
    )

    // === CONCLUSÃO DO MERCADO ===
    .replace(/CONCLUSÃO DO MERCADO/gi,
      '<span style="color:#ef4444;font-weight:700;">CONCLUSÃO DO MERCADO</span>'
    )

    // === Títulos de seção (---) ===
    .replace(/---/g,
      '<hr style="border-color:#1f2937;opacity:0.4;margin:12px 0;">'
    )

    // === Destaques laranja (🟧) ===
    .replace(/🟧\s*([^<\n]+)/g,
      '<span style="color:#fb923c;font-weight:700;">🟧 $1</span>'
    )

    // === Quebra de linha ===
    .replace(/\n/g, "<br>");
}



  // === Modal “Indique um amigo” ===
  const [showIndiqueModal, setShowIndiqueModal] = useState(false);
  const linkIndicacao = `${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${user?.uid || ""}`;

  function IndiqueModal() {
    if (!showIndiqueModal) return null;
    return (
      <div style={modalBackdropStyle}>
        <div style={modalContentStyle}>
          <h3 style={{ color: "#22c55e" }}>🎁 Indique um amigo</h3>
          <p style={{ color: "#ccc", marginBottom: "10px" }}>
            Compartilhe o link abaixo. Quando seu amigo fizer a primeira compra acima de R$ 10,00,
            você ganha <b>20 análises grátis!</b>
          </p>
          <textarea
            readOnly
            value={linkIndicacao}
            style={{
              width: "100%",
              height: "80px",
              background: "#0b1324",
              color: "#fff",
              border: "1px solid #22c55e55",
              borderRadius: "8px",
              padding: "6px",
              fontSize: "0.85rem",
              marginBottom: "10px",
            }}
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(linkIndicacao);
              alert("Link copiado!");
            }}
            style={buttonConfirmStyle}
          >
            📋 Copiar link
          </button>
          <button onClick={() => setShowIndiqueModal(false)} style={buttonCancelStyle}>
            Fechar
          </button>
        </div>
      </div>
    );
  }
// -----------------------------------------------------
// 👇 CONTROLE COMPLETO DE TTS (Texto para Voz)
// -----------------------------------------------------

const [ttsStatus, setTtsStatus] = useState("idle");
// idle | playing

function removerEmojis(t) {
  return t.replace(
    /[\u{1F300}-\u{1FAFF}\u{1F100}-\u{1F1FF}\u{2600}-\u{27BF}]/gu,
    ""
  );
}

function limparTextoNatural(texto) {
  return texto
    .replace(/\*/g, "")
    .replace(/[-–—]{2,}/g, "")
    .replace(/[-–—]\s/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/:\s*\n/g, ": ")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .replace(/\s+\./g, ".")
    .replace(/\s+,/g, ",")
    .trim();
}

function iniciarLeitura(textoOriginal) {
  speechSynthesis.cancel(); // sempre começa limpo

  let t = removerEmojis(textoOriginal);
  t = limparTextoNatural(t);

  const fala = new SpeechSynthesisUtterance(t);
  fala.lang = "pt-BR";
  fala.rate = 1.5;
  fala.pitch = 1;
  fala.volume = 1;

  fala.onend = () => {
    setTtsStatus("idle");
  };

  setTtsStatus("playing");
  speechSynthesis.speak(fala);
}

function pararLeitura() {
  speechSynthesis.cancel();
  setTtsStatus("idle");
}

function handleTTS(resultado) {
  if (ttsStatus === "idle") {
    iniciarLeitura(resultado);
  } else if (ttsStatus === "playing") {
    pararLeitura();
  }
}


const analiseFormatada = formatAnaliseTexto(resultado);
  
  // === Tela inicial de login ===
  if (!user) {
    return (
      <main style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        height: "100vh", background: "linear-gradient(135deg,#0b1324 0%,#111827 100%)",
        color: "#fff", fontFamily: "Inter, sans-serif", padding: "20px",
      }}>
        <div style={{
          background: "rgba(17,24,39,0.85)", border: "2px solid #22c55e55",
          borderRadius: "16px", padding: "40px 30px", width: "90%", maxWidth: "400px",
          textAlign: "center", boxShadow: "0 0 25px rgba(34,197,94,0.15)",
        }}>
          <h1 style={{ position: "absolute", left: "-9999px", top: "0" }}>
  Betgram - Analisador de Apostas Esportivas com Inteligencia Artificial
</h1>
<p style={{ display: "none" }}>
  O Betgram é um analisador de apostas esportiva que usa inteligente artificial (IA) (AI) avançada para transformar dados, estatísticas e odds em insights poderosos. Aposte com estratégia e descubra oportunidades reais de valor.
</p>
<h2 aria-hidden="true" style={{
  display:"flex",
  alignItems:"center",
  gap:"8px",
  justifyContent:"center",
  fontSize:"1.6rem"
}}>
  <img src="/icon.png" alt="Logo" style={{width:"36px",height:"36px",objectFit:"contain"}}/>
  <span style={{color:"#fff"}}>Bem-vindo à <span style={{color:"#22c55e"}}>BetGram</span></span>
</h2>
          <p style={{color:"#ccc"}}>Gere análises inteligentes e descubra as melhores apostas.</p>
          <div style={{
            background:"linear-gradient(90deg,rgba(34,197,94,0.2),rgba(34,197,94,0.05))",
            border:"1px solid #22c55e55",borderRadius:"12px",padding:"10px 20px",
            color:"#a7f3d0",margin:"20px 0"
          }}>🎁 <b style={{color:"#22c55e"}}>Ganhe 10 análises grátis</b> ao criar sua conta</div>
          <button onClick={handleLogin} style={{
            display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",
            background:"#fff",color:"#000",border:"none",borderRadius:"50px",
            padding:"14px 28px",fontWeight:"600",cursor:"pointer",width:"100%"
          }}>
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" style={{width:"22px",height:"22px"}}/>
            Entrar com Google
          </button>
        </div>
      </main>
    );
  }

  // === Painel principal ===
  const primeiroNome = user?.displayName?.split(" ")[0] || "Usuário";
  return (
    <main style={{
      minHeight: "100vh", background: "linear-gradient(135deg,#0b1324,#111827)",
      color: "#fff", fontFamily: "Inter, sans-serif", padding: "4vh 20px 8vh",
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <h2 style={{display:"flex",alignItems:"center",gap:"8px",justifyContent:"center",fontSize:"1.6rem"}}>
        <img src="/icon.png" alt="Logo BetGram" style={{width:"36px",height:"36px",objectFit:"contain"}}/>
        <span style={{color:"#22c55e"}}>BetGram -<span style={{color:"#fff"}}> Analisador Esportivo</span></span>
      </h2>

      <div style={{
        width: "100%", maxWidth: "700px", background: "rgba(17,24,39,0.85)",
        border: "1px solid rgba(34,197,94,0.25)", borderRadius: "16px",
        boxShadow: "0 0 25px rgba(34,197,94,0.08)", padding: "10px", backdropFilter: "blur(8px)",
      }}>
        {/* Cabeçalho */}
        <div style={{ marginBottom: "25px" }}>
          <div style={{
            display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px",flexWrap:"nowrap"
          }}>
            <div style={{fontSize:"1.1rem"}}>👋 Olá, <b>{primeiroNome}</b></div>
            <div style={{
              display:"flex",alignItems:"center",gap:"6px",background:"rgba(17,24,39,0.6)",
              borderRadius:"8px",padding:"4px 10px",border:"1px solid rgba(34,197,94,0.3)",
              boxShadow:"0 0 8px rgba(34,197,94,0.2)",flexShrink:0
            }}>💰 <span style={{color:"#22c55e",fontWeight:600,fontSize:"1rem"}}>
              {dadosUser?.creditos ?? "0"}</span>
            </div>
          </div>

          <button onClick={handleLogout} style={{
            background:"rgba(239,68,68,0.15)",border:"1px solid #ef444455",borderRadius:"8px",
            padding:"8px 14px",color:"#f87171",fontWeight:600,cursor:"pointer",marginTop:"10px",width:"100%"
          }}>🚪 Sair</button>

          {/* Botões principais */}
          <div style={{
            display:"flex",flexWrap:"wrap",gap:"10px",marginTop:"12px",justifyContent:"center",
          }}>
            <button onClick={handleHistorico} style={{
              flex:"1 1 48%",minWidth:"140px",background:"rgba(14,165,233,0.15)",
              border:"1px solid #0ea5e955",borderRadius:"8px",padding:"8px",color:"#38bdf8",
              fontWeight:600,cursor:"pointer"
            }}>🕓 Histórico</button>
            <button onClick={() => setShowBetgramPayModal(true)} style={{
              flex:"1 1 48%",minWidth:"140px",background:"rgba(34,197,94,0.15)",
              border:"1px solid #22c55e55",borderRadius:"8px",padding:"8px",color:"#22c55e",
              fontWeight:600,cursor:"pointer"
            }}>➕ Adicionar Créditos</button>
            
          </div>
        </div>

        {/* Formulário / Resultado / Histórico */}
        {!mostraHistorico && !showBetgramPayModal && (
          !panelFlip ? (
            <><label className="campo-label">🏅 Esporte:</label>
<SelectEsporte value={esporte} onChange={setEsporte} />

            {/* ÁREA NORMAL */}
<div id="area-normal">

  <label>🏆 Competição:</label>

  <div style={{ display:"flex", gap:"10px", marginBottom:"14px" }}>
    <input
      type="text"
      value={competicao}
      onChange={(e) => setCompeticao(e.target.value)}
      placeholder="Competição (ex: Brasileirão)"
      style={inputStyle}
    />

    <input
      type="number"
      value={anoCompeticao}
      onChange={(e) => setAnoCompeticao(e.target.value)}
      placeholder="2025"
      style={{ ...inputStyle, width:"90px", textAlign:"center" }}
    />
  </div>

  <label>🎮 Confronto:</label>
  <input style={inputStyle} value={timeA} onChange={(e)=>setTimeA(e.target.value)} placeholder="Time da Casa"/>
  <input style={inputStyle} value={timeB} onChange={(e)=>setTimeB(e.target.value)} placeholder="Time Visitante"/>

  <label>🎯 Mercado (opcional):</label>
  <input style={inputStyle} value={mercado} onChange={(e)=>setMercado(e.target.value)} placeholder="Ex: Over 2.5"/>

  {mercado && (
    <>
      <label>💰 Odd:</label>
      <input style={inputStyle} type="number" value={odd} onChange={(e)=>setOdd(e.target.value)} placeholder="1.85"/>
    </>
  )}

</div>

{/* ÁREA CARTOLA – FORA do area-normal */}
<div id="area-cartola" style={{ display:"none" }}>

  <label>🧩 Tipo de Análise (Cartola):</label>
  <select id="cartola-tipo" style={inputStyle}>
  <option value="defesa">Defesa (GOL + ZAG)</option>
  <option value="meio">Meio Campo + Laterais (MEI + LAT)</option>
  <option value="ataque">Ataque (ATA + TEC)</option>
  <option value="tecnico">Técnico</option>
  </select>

  <label>💰 Cartoletas:</label>
  <input id="cartola-orcamento" type="number" style={inputStyle} />

  <label>⚽ Tipo de Jogador / Foco da Análise:</label>
<select id="cartola-posicao" style={inputStyle}>
  <option value="">(todos)</option>

  {/* ESPECIAIS */}
  <option value="capitao">Melhor Capitão</option>
  <option value="topo">Topo Pontuadores da Rodada</option>
  <option value="baratos">Bons e Baratos que Pontuam Bem</option>
  <option value="valorizar">Jogadores para Valorizar</option>
</select>

</div>
              <button
  onClick={handleAnalise}
  disabled={carregando}
  className={carregando ? "botao-loading" : ""}
  style={{
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    background: carregando ? "#15803d" : "linear-gradient(90deg,#22c55e,#16a34a)",
    color: "#fff",
    fontWeight: "700",
    fontSize: "1.2rem",
    cursor: carregando ? "not-allowed" : "pointer",
    marginTop: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    opacity: carregando ? 0.9 : 1,
    transition: "0.2s",
  }}
>
  {carregando && <div className="spinner"></div>}
  {carregando ? carregandoFrase : "Analisar"}
</button>

            </>
          ) : (
            <>
              <h3 style={{color:"#22c55e"}}>📊 Resultado da Análise</h3>
              <div style={{
                background:"rgba(11,19,36,0.7)",border:"1px solid rgba(34,197,94,0.2)",
                borderRadius:"10px",padding:"15px",maxHeight:"300px",overflowY:"auto"
              }} dangerouslySetInnerHTML={{ __html: analiseFormatada }}/>
              <button onClick={() => setPanelFlip(false)} style={{
                marginTop:"20px",background:"rgba(14,165,233,0.2)",border:"1px solid #0ea5e955",
                color:"#38bdf8",borderRadius:"8px",padding:"12px",fontWeight:600,cursor:"pointer",width:"100%"
              }}>↩ Voltar</button>

             <button
  onClick={() => handleTTS(resultado)}
  style={{
    marginTop:"10px",
    background:"rgba(34,197,94,0.2)",
    border:"1px solid #22c55e55",
    color:"#22c55e",
    borderRadius:"8px",
    padding:"12px",
    fontWeight:600,
    cursor:"pointer",
    width:"100%",
    transition:"0.2s"
  }}
>
  {ttsStatus === "idle" && "▶️ Ler Análise (1.5x)"}
  {ttsStatus === "playing" && "⏹ Parar Leitura"}
</button>

            </>
          )
        )}

        {mostraHistorico && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"15px"}}>
              <h3 style={{color:"#22c55e",margin:0}}>📜 Últimas análises</h3>
              <button onClick={() => setMostraHistorico(false)} style={{
                background:"rgba(239,68,68,0.15)",border:"1px solid #ef444455",borderRadius:"8px",
                padding:"6px 10px",color:"#f87171"
              }}>❌ Fechar</button>
            </div>
            <div style={{
              maxHeight:"400px",overflowY:"auto",background:"rgba(11,19,36,0.6)",
              borderRadius:"10px",padding:"15px"
            }}>
              {historico.map((h,i)=>(
                <div key={i} style={{
                  borderBottom:"1px dashed rgba(255,255,255,0.1)",marginBottom:"14px",paddingBottom:"10px",
                  background:"rgba(17,24,39,0.4)",borderRadius:"10px",padding:"12px 14px"
                }}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div><b style={{color:"#22c55e"}}>{h.confronto}</b>{" "}
                      <span style={{color:"#0ea5e9"}}>{h.mercado||"Análise completa"}</span></div>
                    <small style={{color:"#94a3b8"}}>{new Date(h.timestamp).toLocaleString("pt-BR")}</small>
                  </div>
                  {h.resposta && (
                    <div style={{
                      marginTop:"10px",background:"rgba(11,19,36,0.75)",border:"1px solid rgba(34,197,94,0.2)",
                      borderRadius:"8px",padding:"10px 12px",color:"#e5e7eb",fontSize:"0.95rem",lineHeight:"1.5",
                      maxHeight:"200px",overflowY:"auto"
                    }} dangerouslySetInnerHTML={{__html:formatAnaliseTexto(h.resposta)}}/>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmacaoModal
        show={showConfirmacaoModal}
        onConfirm={gerarESalvarAnalise}
        onCancel={() => setShowConfirmacaoModal(false)}
        timeA={timeA}
        timeB={timeB}
        creditos={dadosUser?.creditos ?? 0}
      />

      {showBetgramPayModal && user && (
        <BetgramPayModal onClose={handleClosePayModal} user={user}/>
      )}

      <IndiqueModal/>
    </main>
  );
}
