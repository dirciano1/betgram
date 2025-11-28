// Betgram/app/api/analise/route.js
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { gerarContextoGlobal } from "../../../prompts/global";

// ======================================================
// 🔥 GEMINI PRINCIPAL — COM RETRY INTELIGENTE (5 TENTATIVAS)
// ======================================================
async function gerarComGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenerativeAI(apiKey);

  const model = ai.getGenerativeModel({
    model: "gemini-2.5-flash",
    tools: [{ googleSearch: {} }],
  });

  const MAX_RETRY = 5;

  const delays = [
    0,      // tentativa 1: sem delay
    800,    // tentativa 2: rápido
    1500,   // tentativa 3: começa a avisar lentidão
    2500,   // tentativa 4
    3500    // tentativa 5
  ];

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

      // Only retry when overloaded
      if (
        error.status === 503 ||
        error.message.includes("overloaded") ||
        error.message.includes("temporarily") ||
        error.message.includes("unavailable")
      ) {
        console.log("⚠️ Gemini sobrecarregado — nova tentativa…");
        await new Promise((res) => setTimeout(res, delays[i]));
        continue;
      }

      return { ok: false, error };
    }
  }

  return { ok: false, error: new Error("Gemini falhou após 5 tentativas") };
}

// ======================================================
// 🔥 ROTA PRINCIPAL — USANDO SOMENTE GEMINI
// ======================================================
export async function POST(req) {
  try {
    const { prompt, confronto } = await req.json();

    if (!prompt || prompt.trim().length < 3) {
      return NextResponse.json(
        { error: "Prompt inválido." },
        { status: 400 }
      );
    }

    // Regras ocultas do global.js
    const promptGlobal = gerarContextoGlobal(confronto || "Confronto não informado");

    // ======================================================
    // 1️⃣ Tenta SOMENTE o Gemini (com retries)
    // ======================================================
    const gemini = await gerarComGemini(prompt);

    if (gemini.ok) {
      return NextResponse.json({
        content: gemini.text,
        fallback: false,
        retry: false,
        model: "gemini",
        tentativas: gemini.tentativa
      });
    }

    // ======================================================
    // ❌ Gemini não conseguiu (mesmo após 5 tentativas)
    //     → NÃO desconta crédito
    //     → Pede para o usuário tentar novamente
    // ======================================================
    return NextResponse.json(
      {
        error: "Os servidores estão um pouco lentos no momento. Nenhum crédito foi descontado. Tente novamente em alguns instantes.",
        retry: true
      },
      { status: 503 }
    );

  } catch (error) {
    console.error("🔥 ERRO GERAL:", error);

    return NextResponse.json(
      {
        error: "Erro inesperado no servidor. Nenhum crédito foi descontado.",
        retry: true
      },
      { status: 500 }
    );
  }
}
