// app/api/analise/route.js
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

// =========================================================
// 🔥 PRINCIPAL — GEMINI 2.5 FLASH (com web-search real)
// =========================================================
async function gerarComGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenerativeAI(apiKey);

  const model = ai.getGenerativeModel({
    model: "gemini-2.5-flash",
    tools: [{ googleSearch: {} }],
  });

  const tentativas = 3;

  for (let i = 0; i < tentativas; i++) {
    try {
      console.log(`🔎 Gemini tentativa ${i + 1}/${tentativas}`);

      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const text = response.response.text();
      if (!text) throw new Error("Resposta vazia do Gemini");

      return { ok: true, text };
    } catch (error) {
      if (error.status === 503 || error.message.includes("overloaded")) {
        console.log("⚠️ Gemini sobrecarregado — retry…");
        await new Promise((r) => setTimeout(r, 1200));
        continue;
      }

      console.log("❌ Erro no Gemini:", error.message);
      return { ok: false, error };
    }
  }

  return { ok: false, error: new Error("Gemini falhou após retries") };
}

// =========================================================
// 🔥 PROMPT EXTRA PARA FALLBACK (texto grande estilo Gemini)
// =========================================================
function montarPromptFallback(promptOriginal) {
  return `
INSTRUÇÕES IMPORTANTES (MODO FALLBACK):

Você NÃO tem acesso à internet.
Portanto, gere uma análise EXTREMAMENTE COMPLETA, com NO MÍNIMO **600 palavras**,
seguindo exatamente o estilo da Betgram IA.

ANALISE OBRIGATORIAMENTE TODOS OS MERCADOS ABAIXO:

- Resultado Final (1X2)
- Over/Under 2.5 gols
- Ambas Marcam (BTTS)
- Escanteios (Over/Under 9.5 )
- Cartões (Over/Under 5.5)
- Valor Esperado (EV)
- Odds Justas
- Conclusões detalhadas por mercado

Siga o estilo da Betgram IA:
- Títulos com emojis
- Estrutura organizada
- Probabilidades estimadas
- Recomendações claras
- Linguagem técnica, porém acessível

AGORA RESPONDA COM BASE NO PROMPT ORIGINAL:

"${promptOriginal}"
`;
}

// =========================================================
// 🔥 FALLBACK 1 — GPT-5-mini (API nova)
// =========================================================
async function gerarComGPT5(promptOriginal) {
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    console.log("🟠 Fallback → GPT-5-mini…");

    const prompt = montarPromptFallback(promptOriginal);

    const completion = await client.responses.create({
      model: "gpt-5-mini",
      input: prompt,
      max_completion_tokens: 5000,
      temperature: 0.7,
    });

    return { ok: true, text: completion.output_text };
  } catch (error) {
    console.log("❌ Erro no GPT-5-mini:", error.message);
    return { ok: false, error };
  }
}

// =========================================================
// 🔥 FALLBACK 2 — GPT-4o-mini (API nova)
// =========================================================
async function gerarComGPT4(promptOriginal) {
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    console.log("🟡 Fallback → GPT-4o-mini…");

    const prompt = montarPromptFallback(promptOriginal);

    const completion = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      max_completion_tokens: 5000,
      temperature: 0.7,
    });

    return { ok: true, text: completion.output_text };
  } catch (error) {
    console.log("❌ Erro no GPT-4o-mini:", error.message);
    return { ok: false, error };
  }
}

// =========================================================
// 🔥 ROTA PRINCIPAL — ORQUESTRAÇÃO
// =========================================================
export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || prompt.trim().length < 3) {
      return NextResponse.json(
        { error: "Prompt inválido." },
        { status: 400 }
      );
    }

    // 1️⃣ GEMINI (principal)
    const gemini = await gerarComGemini(prompt);
    if (gemini.ok) {
      return NextResponse.json({
        content: gemini.text,
        fallback: false,
        modelo: "gemini",
      });
    }

    console.log("⚠️ Gemini falhou — fallback para GPT-5-mini.");

    // 2️⃣ GPT-5-mini (fallback)
    const gpt5 = await gerarComGPT5(prompt);
    if (gpt5.ok) {
      return NextResponse.json({
        content: gpt5.text,
        fallback: true,
        modelo: "gpt-5-mini",
      });
    }

    console.log("⚠️ GPT-5-mini falhou — fallback para GPT-4o-mini.");

    // 3️⃣ GPT-4o-mini (fallback final)
    const gpt4 = await gerarComGPT4(prompt);
    if (gpt4.ok) {
      return NextResponse.json({
        content: gpt4.text,
        fallback: true,
        modelo: "gpt-4o-mini",
      });
    }

    // 4️⃣ Nenhum modelo respondeu
    return NextResponse.json(
      { error: "Nenhum modelo conseguiu gerar resposta." },
      { status: 500 }
    );
  } catch (error) {
    console.error("🔥 ERRO GERAL:", error);
    return NextResponse.json(
      { error: error.message || "Erro desconhecido" },
      { status: 500 }
    );
  }
}
