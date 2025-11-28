import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { gerarContextoGlobal } from "../../../prompts/global";

// ======================================================
// 🛡️ 1. PROTEÇÃO DE HOST (ANTI-VERCEL EDGE)
// ======================================================
function hostInvalido(req) {
  const host = req.headers.get("host") || "";
  return host !== "betgram.com.br" && host !== "www.betgram.com.br";
}

// ======================================================
// 🛡️ 2. FILTRO ANTI-RESPOSTA CONTAMINADA (BASQUETE x FUTEBOL)
// ======================================================
function respostaInvalida(prompt, texto) {
  if (prompt.includes("especialista em Basquete")) {
    const termosProibidos = [
      "Ambas Marcam",
      "BTTS",
      "Resultado Final (1X2)",
      "1X2",
      "⚽",
      "Handicap Asiático",
      "gols",
    ];
    if (termosProibidos.some((t) => texto.includes(t))) {
      console.log("🚫 Resposta inválida (conteúdo de futebol em basquete).");
      return true;
    }
  }
  return false;
}

// ======================================================
// 🧠 3. GEMINI
// ======================================================
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenerativeAI(apiKey);
const model = ai.getGenerativeModel({
  model: "gemini-2.5-flash",
  tools: [{ googleSearch: {} }],
});

// Retry
async function gerarComGemini(prompt) {
  const MAX_RETRY = 5;
  const delays = [0, 800, 1500, 2500, 3500];

  for (let i = 0; i < MAX_RETRY; i++) {
    try {
      console.log(`🔎 Gemini tentativa ${i + 1}/${MAX_RETRY}`);

      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const text = response.response.text();

      if (!text || text.trim() === "") throw new Error("Resposta vazia do Gemini");

      return { ok: true, text, tentativa: i + 1 };
    } catch (error) {
      console.log("⚠️ Erro Gemini:", error.message);

      if (
        error.status === 503 ||
        error.message.includes("overloaded") ||
        error.message.includes("temporarily") ||
        error.message.includes("unavailable")
      ) {
        await new Promise((r) => setTimeout(r, delays[i]));
        continue;
      }

      return { ok: false, error };
    }
  }

  return { ok: false, error: new Error("Gemini falhou após 5 tentativas") };
}

// ======================================================
// 🧩 4. COLETA UNIVERSAL DE MÉDIAS
// ======================================================
function montarPromptStatsUniversal(esporte, time, ano) {
  switch (esporte) {
    case "futebol":
    case "futsal":
    case "hoquei":
    case "handebol":
    case "rugby":
      return `
Você é um coletor de estatísticas oficiais da temporada ${ano}.
Retorne APENAS este JSON:

{
  "feitos": <média de gols marcados>,
  "sofridos": <média de gols sofridos>
}

Time: ${time}
Esporte: Futebol
Ano: ${ano}
`;

    case "basquete":
      return `
{
  "feitos": <média de pontos marcados>,
  "sofridos": <média de pontos sofridos>
}

Time: ${time}
Esporte: Basquete
Ano: ${ano}
`;

    case "volei":
      return `
{
  "feitos": <média de sets vencidos>,
  "sofridos": <média de sets perdidos>
}

Time: ${time}
Esporte: Vôlei
Ano: ${ano}
`;

    case "tenis":
      return `
{
  "feitos": <média de games vencidos>,
  "sofrridos": <média de games perdidos>
}

Jogador: ${time}
Esporte: Tênis
Ano: ${ano}
`;

    case "mma":
    case "boxe":
      return `
{
  "feitos": <golpes significativos conectados/min>,
  "sofridos": <golpes absorvidos/min>
}

Lutador: ${time}
Esporte: ${esporte}
Ano: ${ano}
`;

    case "eSports":
      return `
{
  "feitos": <rounds/mapas vencidos>,
  "sofridos": <rounds/mapas perdidos>
}

Time: ${time}
Esporte: eSports
Ano: ${ano}
`;

    default:
      return `
{
  "feitos": <métrica ofensiva>,
  "sofridos": <métrica defensiva>
}

Time/Participante: ${time}
Esporte: ${esporte}
Ano: ${ano}
`;
  }
}

async function obterMediasUniversais(esporte, time, ano) {
  const promptStats = montarPromptStatsUniversal(esporte, time, ano);

  const resp = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: promptStats }] }],
  });

  const texto = resp.response.text() || "";

  try {
    const json = JSON.parse(texto);
    if (
      typeof json.feitos === "number" &&
      typeof json.sofridos === "number" &&
      json.feitos >= 0 &&
      json.sofridos >= 0
    ) {
      return json;
    }
  } catch {}

  return null;
}

// ======================================================
// 🧠 5. MODELO UNIVERSAL (Modelo B)
// ======================================================
function fatorial(n) {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function poisson(k, lambda) {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / fatorial(k);
}

const ESPORTES_COM_POISSON = ["futebol", "futsal", "handebol", "hoquei", "rugby"];
const ESPORTES_COM_MANDO = [
  "futebol",
  "futsal",
  "basquete",
  "handebol",
  "hoquei",
  "rugby",
  "beisebol",
  "eSports",
];

function calcularModeloUniversal(esporte, timeA, timeB, mediasA, mediasB) {
  const ataqueA = mediasA.feitos;
  const defesaA = mediasA.sofridos;
  const ataqueB = mediasB.feitos;
  const defesaB = mediasB.sofridos;

  let lambdaA = 0.6 * ataqueA + 0.4 * defesaB;
  let lambdaB = 0.6 * ataqueB + 0.4 * defesaA;

  if (ESPORTES_COM_MANDO.includes(esporte)) {
    lambdaA *= 1.1;
    lambdaB *= 0.95;
  }

  let probCasa = 0,
    probEmpate = 0,
    probVisitante = 0;

  if (ESPORTES_COM_POISSON.includes(esporte)) {
    const max = 10;
    for (let gA = 0; gA <= max; gA++) {
      const pA = poisson(gA, lambdaA);
      for (let gB = 0; gB <= max; gB++) {
        const pB = poisson(gB, lambdaB);
        const p = pA * pB;
        if (gA > gB) probCasa += p;
        else if (gA < gB) probVisitante += p;
        else probEmpate += p;
      }
    }
  } else {
    const total = lambdaA + lambdaB || 1;
    probCasa = lambdaA / total;
    probVisitante = lambdaB / total;
  }

  const soma = probCasa + probEmpate + probVisitante || 1;
  probCasa /= soma;
  probEmpate /= soma;
  probVisitante /= soma;

  return {
    lambdaA,
    lambdaB,
    probCasa,
    probEmpate,
    probVisitante,
    oddCasa: probCasa > 0 ? 1 / probCasa : null,
    oddEmpate: probEmpate > 0 ? 1 / probEmpate : null,
    oddVisitante: probVisitante > 0 ? 1 / probVisitante : null,
    mediasA,
    mediasB,
  };
}

// ======================================================
// 🧱 6. BLOCO INTERNO DO MODELO
// ======================================================
function montarBlocoModeloUniversal({
  esporte,
  confronto,
  timeA,
  timeB,
  modelo,
}) {
  const probCasaPct = (modelo.probCasa * 100).toFixed(1);
  const probEmpatePct = (modelo.probEmpate * 100).toFixed(1);
  const probVisitantePct = (modelo.probVisitante * 100).toFixed(1);

  return `
⚠️ INSTRUÇÃO SISTÊMICA BETGRAM — NÃO MOSTRAR AO USUÁRIO ⚠️
NÚMEROS FIXOS DO MOTOR UNIVERSAL (Modelo B)

Esporte: ${esporte}
Confronto: ${confronto}

MÉDIAS UNIVERSAIS
${timeA} — feitos: ${modelo.mediasA.feitos}, sofridos: ${modelo.mediasA.sofridos}
${timeB} — feitos: ${modelo.mediasB.feitos}, sofridos: ${modelo.mediasB.sofridos}

LAMBDA
- ${timeA}: ${modelo.lambdaA.toFixed(3)}
- ${timeB}: ${modelo.lambdaB.toFixed(3)}

PROBABILIDADES FIXAS
- Vitória ${timeA}: ${probCasaPct}%
- Empate: ${probEmpatePct}% 
- Vitória ${timeB}: ${probVisitantePct}%

ODDS JUSTAS FIXAS
- ${timeA}: ${modelo.oddCasa?.toFixed(2)}
- Empate: ${modelo.oddEmpate?.toFixed(2)}
- ${timeB}: ${modelo.oddVisitante?.toFixed(2)}

REGRAS:
1. Não recalcular nada.
2. Não alterar probabilidades.
3. Não alterar odds.
4. Usar esses números exatamente.
`;
}

// ======================================================
// 🚀 7. ROTA PRINCIPAL
// ======================================================
export async function POST(req) {
  try {
    if (hostInvalido(req)) {
      return NextResponse.json(
        { error: "Instância inválida.", retry: true },
        { status: 503 }
      );
    }

    const body = await req.json();

    // LEGADO
    if (typeof body === "object" && body.prompt && !body.esporte) {
      const { prompt } = body;

      if (!prompt || prompt.trim().length < 3) {
        return NextResponse.json({ error: "Prompt inválido." }, { status: 400 });
      }

      const gemini = await gerarComGemini(prompt);

      if (gemini.ok) {
        return NextResponse.json({
          content: gemini.text,
          fallback: false,
          retry: false,
          model: "gemini",
          tentativas: gemini.tentativa,
        });
      }

      return NextResponse.json(
        { error: "Servidores lentos. Tente novamente.", retry: true },
        { status: 503 }
      );
    }

    // NOVO MODELO UNIVERSAL
    const {
      prompt,
      esporte,
      timeA,
      timeB,
      competicao,
      ano,
      mercado,
      odd,
    } = body;

    if (!prompt || !esporte || !timeA || !timeB || !ano) {
      return NextResponse.json(
        { error: "Parâmetros insuficientes.", retry: true },
        { status: 400 }
      );
    }

    const confronto = `${timeA} x ${timeB}`;

    // COLETAR MÉDIAS
    const mediasA = await obterMediasUniversais(esporte, timeA, ano);
    const mediasB = await obterMediasUniversais(esporte, timeB, ano);

    if (!mediasA || !mediasB) {
      const gemini = await gerarComGemini(prompt);
      if (gemini.ok) {
        return NextResponse.json({
          content: gemini.text,
          fallback: true,
          retry: false,
          model: "gemini",
          tentativas: gemini.tentativa,
        });
      }
      return NextResponse.json(
        { error: "Falha ao coletar estatísticas.", retry: true },
        { status: 503 }
      );
    }

    // MODELO UNIVERSAL
    const modelo = calcularModeloUniversal(esporte, timeA, timeB, mediasA, mediasB);

    const blocoInterno = montarBlocoModeloUniversal({
      esporte,
      confronto,
      timeA,
      timeB,
      modelo,
    });

    const promptFinal = `
${blocoInterno}

/* A partir daqui, siga EXACTAMENTE o formato do prompt Betgram. NÃO altere as probabilidades e odds. */

${prompt}
    `.trim();

    const gemini = await gerarComGemini(promptFinal);

    if (gemini.ok) {
      return NextResponse.json({
        content: gemini.text,
        fallback: false,
        retry: false,
        model: "gemini-universal",
        tentativas: gemini.tentativa,

        stats: {
          confronto,
          esporte,
          mediasA,
          mediasB,
          probCasa: modelo.probCasa,
          probEmpate: modelo.probEmpate,
          probVisitante: modelo.probVisitante,
          oddCasa: modelo.oddCasa,
          oddEmpate: modelo.oddEmpate,
          oddVisitante: modelo.oddVisitante,
        },
      });
    }

    return NextResponse.json(
      { error: "Servidores lentos. Nenhum crédito foi descontado.", retry: true },
      { status: 503 }
    );
  } catch (error) {
    console.error("🔥 ERRO GERAL:", error);

    return NextResponse.json(
      { error: "Erro interno. Nenhum crédito descontado.", retry: true },
      { status: 500 }
    );
  }
}
