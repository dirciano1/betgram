// Betgram/app/api/analise/route.js
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { gerarContextoGlobal } from "../../../prompts/global";

// ======================================================
// 🛡️ 1. PROTEÇÃO DE HOST (ANTI-VERCEL EDGE)
// ======================================================
function hostInvalido(req) {
  const host = req.headers.get("host") || "";

  // SOMENTE seu domínio principal pode processar análise
  return host !== "betgram.com.br" && host !== "www.betgram.com.br";
}

// ======================================================
// 🛡️ 2. FILTRO ANTI-RESPOSTA CONTAMINADA
// ======================================================
function respostaInvalida(prompt, texto) {
  // BASQUETE
  if (prompt.includes("especialista em Basquete")) {
    const termosProibidos = [
      "Ambas Marcam",
      "BTTS",
      "Resultado Final (1X2)",
      "1X2",
      "⚽",
      "Handicap Asiático",
      "Ambas equipes marcam",
      "gols",
    ];

    if (termosProibidos.some((t) => texto.includes(t))) {
      console.log("🚫 Resposta inválida detectada (conteúdo de futebol em basquete).");
      return true;
    }
  }

  // Aqui você pode adicionar filtros para outros esportes depois

  return false;
}

// ======================================================
// 🧠 3. GEMINI COM RETRY (5 TENTATIVAS INTELIGENTES)
// ======================================================
async function gerarComGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;

  const ai = new GoogleGenerativeAI(apiKey);
  const model = ai.getGenerativeModel({
    model: "gemini-2.5-flash",
    tools: [{ googleSearch: {} }],
  });

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

      // Erro recuperável → retry
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

      // Erro NÃO recuperável
      return { ok: false, error };
    }
  }

  return { ok: false, error: new Error("Gemini falhou após 5 tentativas") };
}

// ======================================================
// 🚀 4. ROTA PRINCIPAL
// ======================================================
export async function POST(req) {
  try {
    // 🛑 Bloqueia hosts da Vercel (edge ruim)
    if (hostInvalido(req)) {
      console.log("🚫 Bloqueado: Host inválido.");
      return NextResponse.json(
        {
          error: "Instância inválida. Tente novamente.",
          retry: true,
        },
        { status: 503 }
      );
    }

    const { prompt, confronto } = await req.json();

    if (!prompt || prompt.trim().length < 3) {
      return NextResponse.json(
        { error: "Prompt inválido." },
        { status: 400 }
      );
    }

    // Regras ocultas se quiser integrar (não necessárias pelo Gemini)
    const promptGlobal = gerarContextoGlobal(confronto || "Confronto não informado");
    void promptGlobal; // somente para evitar warning

    // 🔥 Tenta Gemini com 5 retries
    const gemini = await gerarComGemini(prompt);

    if (gemini.ok) {
      // 🛡️ Filtra resposta contaminada antes de enviar ao usuário
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

      // 🔥 Sucesso real (Gemini verdadeiro)
      return NextResponse.json({
        content: gemini.text,
        fallback: false,
        retry: false,
        model: "gemini",
        tentativas: gemini.tentativa,
      });
    }

    // ❌ Gemini não conseguiu após 5 tentativas
    return NextResponse.json(
      {
        error:
          "Os servidores estão um pouco lentos agora. Nenhum crédito foi descontado. Tente novamente em instantes.",
        retry: true,
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("🔥 ERRO GERAL:", error);

    return NextResponse.json(
      {
        error: "Erro inesperado. Nenhum crédito foi descontado.",
        retry: true,
      },
      { status: 500 }
    );
  }
}
