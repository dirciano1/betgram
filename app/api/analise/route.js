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
// 🧠 3. GEMINI (REUTILIZADO PARA TUDO)
// ======================================================
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenerativeAI(apiKey);
const model = ai.getGenerativeModel({
  model: "gemini-2.5-flash",
  tools: [{ googleSearch: {} }],
});

// Retry inteligente para o prompt final
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

      if (!text || text.trim() === "") {
        throw new Error("Resposta vazia do Gemini");
      }

      return { ok: true, text, tentativa: i + 1 };
    } catch (error) {
      console.log("⚠️ Erro Gemini:", error.message);

      if (
        error.status === 503 ||
        error.message.includes("overloaded") ||
        error.message.includes("temporarily") ||
        error.message.includes("unavailable")
      ) {
        console.log("⏳ Gemini sobrecarregado — nova tentativa…");
        await new Promise((res) => setTimeout(res, delays[i]));
        continue;
      }

      return { ok: false, error };
    }
  }

  return { ok: false, error: new Error("Gemini falhou após 5 tentativas") };
}

// ======================================================
// 🧩 4. COLETA UNIVERSAL DE MÉDIAS (feitos / sofridos)
// ======================================================
function montarPromptStatsUniversal(esporte, time, ano) {
  // Tudo vira "feitos" e "sofridos", mas a IA sabe o que é por esporte
  switch (esporte) {
    case "futebol":
    case "futsal":
    case "hoquei":
    case "handebol":
    case "rugby":
      return `
Você é um coletor de estatísticas oficiais da temporada ${ano}.
Retorne APENAS este JSON, sem texto extra:

{
  "feitos": <média de gols marcados por jogo na temporada ${ano}>,
  "sofridos": <média de gols sofridos por jogo na temporada ${ano}>
}

Time: ${time}
Esporte: Futebol
Ano: ${ano}
`;

    case "basquete":
      return `
Você é um coletor de estatísticas oficiais da temporada ${ano}.
Retorne APENAS este JSON, sem texto extra:

{
  "feitos": <média de pontos marcados por jogo na temporada ${ano}>,
  "sofridos": <média de pontos sofridos por jogo na temporada ${ano}>
}

Time: ${time}
Esporte: Basquete
Ano: ${ano}
`;

    case "volei":
      return `
Você é um coletor de estatísticas oficiais da temporada ${ano}.
Retorne APENAS este JSON, sem texto extra:

{
  "feitos": <média de sets vencidos por partida na temporada ${ano}>,
  "sofridos": <média de sets perdidos por partida na temporada ${ano}>
}

Time: ${time}
Esporte: Vôlei
Ano: ${ano}
`;

    case "tenis":
      return `
Você é um coletor de estatísticas oficiais da temporada ${ano}.
Retorne APENAS este JSON, sem texto extra:

{
  "feitos": <média de games vencidos por partida/set na temporada ${ano}>,
  "sofridos": <média de games perdidos por partida/set na temporada ${ano}>
}

Jogador: ${time}
Esporte: Tênis
Ano: ${ano}
`;

    case "mma":
    case "boxe":
      return `
Você é um coletor de estatísticas oficiais recentes.
Retorne APENAS este JSON, sem texto extra:

{
  "feitos": <golpes significativos conectados por minuto>,
  "sofridos": <golpes significativos absorvidos por minuto>
}

Lutador: ${time}
Esporte: ${esporte.toUpperCase()}
Ano: ${ano}
`;

    case "eSports":
      return `
Você é um coletor de estatísticas oficiais recentes.
Retorne APENAS este JSON, sem texto extra:

{
  "feitos": <média de rounds/mapas vencidos por partida>,
  "sofridos": <média de rounds/mapas perdidos por partida>
}

Time: ${time}
Esporte: eSports
Ano: ${ano}
`;

    default:
      // fallback genérico
      return `
Você é um coletor de estatísticas oficiais da temporada ${ano}.
Retorne APENAS este JSON, sem texto extra:

{
  "feitos": <métrica ofensiva média da temporada (o que o time produz)>,
  "sofridos": <métrica defensiva média da temporada (o que o time cede)>
}

Time ou participante: ${time}
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
  } catch (e) {
    console.log("⚠️ Falha ao parsear JSON de stats:", texto);
  }

  return null;
}

// ======================================================
// 🧠 5. MODELO UNIVERSAL (Modelo B + Poisson/Proporcional)
// ======================================================
function fatorial(n) {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function poisson(k, lambda) {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / fatorial(k);
}

// esportes onde faz sentido empate + placar baixo
const ESPORTES_COM_POISSON = ["futebol", "futsal", "handebol", "hoquei", "rugby"];

// esportes com mando de campo
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
    lambdaA *= 1.1; // mandante levemente favorecido
    lambdaB *= 0.95;
  }

  let probCasa = 0;
  let probEmpate = 0;
  let probVisitante = 0;

  if (ESPORTES_COM_POISSON.includes(esporte)) {
    // Poisson clássico 0–10 (placar baixo)
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
    // Esportes sem empate ou de placar alto (basquete, tênis, MMA, etc.)
    const total = lambdaA + lambdaB || 1;
    probCasa = lambdaA / total;
    probVisitante = lambdaB / total;
    probEmpate = 0;
  }

  const soma = probCasa + probEmpate + probVisitante || 1;

  probCasa /= soma;
  probEmpate /= soma;
  probVisitante /= soma;

  const oddCasa = probCasa > 0 ? 1 / probCasa : null;
  const oddEmpate = probEmpate > 0 ? 1 / probEmpate : null;
  const oddVisitante = probVisitante > 0 ? 1 / probVisitante : null;

  return {
    lambdaA,
    lambdaB,
    probCasa,
    probEmpate,
    probVisitante,
    oddCasa,
    oddEmpate,
    oddVisitante,
    mediasA,
    mediasB,
  };
}

// ======================================================
// 🧱 6. BLOCO INTERNO DO MODELO (INSTRUÇÃO SISTÊMICA)
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
As informações abaixo são internas, calculadas pelo Motor Universal Betgram
(Modelo B) e NÃO podem ser alteradas ou recalculadas pela IA.

Esporte: ${esporte}
Confronto: ${confronto}
Time A (mandante): ${timeA}
Time B (visitante): ${timeB}

MÉDIAS UNIVERSAIS DA TEMPORADA (feitos / sofridos)
- ${timeA} — feitos: ${modelo.mediasA.feitos}, sofridos: ${modelo.mediasA.sofridos}
- ${timeB} — feitos: ${modelo.mediasB.feitos}, sofridos: ${modelo.mediasB.sofridos}

MODELO B (60% ofensivo + 40% defensivo), com ajuste de mando quando aplicável:
- lambda_A (mandante): ${modelo.lambdaA.toFixed(3)}
- lambda_B (visitante): ${modelo.lambdaB.toFixed(3)}

PROBABILIDADES FIXAS CALCULADAS PELO MOTOR (NÃO ALTERAR)
- Vitória ${timeA}: ${probCasaPct}%
- Empate: ${probEmpatePct}% 
- Vitória ${timeB}: ${probVisitantePct}%

ODDS JUSTAS DO MOTOR (NÃO ALTERAR)
- ${timeA}: ${modelo.oddCasa ? modelo.oddCasa.toFixed(2) : "N/A"}
- Empate: ${modelo.oddEmpate ? modelo.oddEmpate.toFixed(2) : "N/A"}
- ${timeB}: ${modelo.oddVisitante ? modelo.oddVisitante.toFixed(2) : "N/A"}

REGRAS OBRIGATÓRIAS:
1. Você NÃO pode recalcular essas probabilidades.
2. Você NÃO pode ajustar essas odds justas.
3. Sua função é APENAS interpretar, explicar e comparar com a odd enviada
   pelo usuário (quando existir), seguindo o formato do prompt abaixo.
4. Nunca contradiga esses números. Trate-os como verdade absoluta do sistema.
`;
}

// ======================================================
// 🚀 7. ROTA PRINCIPAL
// ======================================================
export async function POST(req) {
  try {
    if (hostInvalido(req)) {
      console.log("🚫 Bloqueado: Host inválido.");
      return NextResponse.json(
        { error: "Instância inválida. Tente novamente.", retry: true },
        { status: 503 }
      );
    }

    const body = await req.json();

    // LEGADO: se vier só { prompt }, mantém comportamento antigo
    if (typeof body === "object" && body.prompt && !body.esporte) {
      const { prompt, confronto } = body;

      if (!prompt || prompt.trim().length < 3) {
        return NextResponse.json({ error: "Prompt inválido." }, { status: 400 });
      }

      // só para manter compatível, sem usar aqui
      const promptGlobal = gerarContextoGlobal(
        confronto || "Confronto não informado"
      );
      void promptGlobal;

      const gemini = await gerarComGemini(prompt);

      if (gemini.ok) {
        if (respostaInvalida(prompt, gemini.text)) {
          return NextResponse.json(
            {
              error:
                "A análise não está consistente com o esporte selecionado. Nenhum crédito foi descontado. Tente novamente.",
              retry: true,
              invalid: true,
            },
            { status: 503 }
          );
        }

        return NextResponse.json({
          content: gemini.text,
          fallback: false,
          retry: false,
          model: "gemini",
          tentativas: gemini.tentativa,
        });
      }

      return NextResponse.json(
        {
          error:
            "Os servidores estão um pouco lentos agora. Nenhum crédito foi descontado. Tente novamente em instantes.",
          retry: true,
        },
        { status: 503 }
      );
    }

    // NOVO MODO UNIVERSAL
    const {
      prompt,
      esporte,
      timeA,
      timeB,
      competicao,
      anoCompeticao,
      mercado,
      odd,
    } = body;

    if (!prompt || !esporte || !timeA || !timeB || !anoCompeticao) {
      return NextResponse.json(
        { error: "Parâmetros insuficientes para motor universal." },
        { status: 400 }
      );
    }

    const confronto = `${timeA} x ${timeB}`;

    // 1) Coletar médias universais de A e B
    const mediasA = await obterMediasUniversais(esporte, timeA, anoCompeticao);
    const mediasB = await obterMediasUniversais(esporte, timeB, anoCompeticao);

    if (!mediasA || !mediasB) {
      console.log("⚠️ Falha na coleta de stats universais, caindo para modo antigo.");
      // fallback: usa prompt original sem bloco extra
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
        {
          error:
            "Não foi possível coletar dados estatísticos agora. Nenhum crédito foi descontado.",
          retry: true,
        },
        { status: 503 }
      );
    }

    // 2) Modelo universal (Modelo B)
    const modelo = calcularModeloUniversal(
      esporte,
      timeA,
      timeB,
      mediasA,
      mediasB
    );

    // 3) Monta bloco interno fixo + prompt original
    const blocoInterno = montarBlocoModeloUniversal({
      esporte,
      confronto,
      timeA,
      timeB,
      modelo,
    });

    const promptFinal = `
${blocoInterno}

/* A partir daqui, siga EXATAMENTE o formato e as instruções do prompt Betgram abaixo. 
   Use SEMPRE as probabilidades e odds já calculadas no bloco interno.
*/

${prompt}
    `.trim();

    // 4) Chama Gemini com retry
    const gemini = await gerarComGemini(promptFinal);

    if (gemini.ok) {
      if (respostaInvalida(promptFinal, gemini.text)) {
        return NextResponse.json(
          {
            error:
              "A análise não está consistente com o esporte selecionado. Nenhum crédito foi descontado. Tente novamente.",
            retry: true,
            invalid: true,
          },
          { status: 503 }
        );
      }

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
      {
        error:
          "Os servidores estão um pouco lentos agora. Nenhum crédito foi descontado. Tente novamente em instantes.",
        retry: true,
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("🔥 ERRO GERAL (motor universal):", error);

    return NextResponse.json(
      {
        error: "Erro inesperado. Nenhum crédito foi descontado.",
        retry: true,
      },
      { status: 500 }
    );
  }
}
