// Betgram/app/api/analise/route.js
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

// IMPORT CORRETO DO GLOBAL.JS (SEM @)
import { gerarContextoGlobal } from "../../../prompts/global";

// ======================================================
// 🔥 1. GEMINI PRINCIPAL — COM PESQUISA REAL
// ======================================================
async function gerarComGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenerativeAI(apiKey);

  const model = ai.getGenerativeModel({
    model: "gemini-2.5-flash",
    tools: [{ googleSearch: {} }],
  });

  const maxTentativas = 3;

  for (let i = 0; i < maxTentativas; i++) {
    try {
      console.log(`🔎 Gemini tentativa ${i + 1}/${maxTentativas}`);

      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const text = response.response.text();
      if (!text) throw new Error("Resposta vazia do Gemini");

      return { ok: true, text };
    } catch (error) {
      if (error.status === 503 || error.message.includes("overloaded")) {
        console.log("⚠️ Gemini sobrecarregado — retry…");
        await new Promise((res) => setTimeout(res, 1200));
        continue;
      }

      console.log("❌ Erro no Gemini:", error.message);
      return { ok: false, error };
    }
  }

  return { ok: false, error: new Error("Gemini falhou após 3 tentativas") };
}

// ======================================================
// 🔥 2. PROMPT UNIVERSAL PARA FALLBACK
// ======================================================
function montarPromptFallback(promptOriginal, promptGlobal) {
  return `
⚠️ INSTRUÇÃO INTERNA — MODO FALLBACK SEM INTERNET  
Estas regras NÃO devem aparecer na resposta final.

==============================
📌 COMO FUNCIONA O FALLBACK
==============================
- Você NÃO tem acesso à internet.
- NÃO mencione que está sem internet.
- NÃO mencione fallback.
- NÃO pesquise nada externo.
- NÃO invente jogos específicos.
- Gere uma análise EXTREMAMENTE completa.
- Mínimo obrigatório de **600 palavras**.
- Siga exatamente os mercados do prompt do esporte.
- NÃO adicione mercados novos.
- Não retire mercados solicitados.

==============================
📌 CONTEXTO GLOBAL (NÃO EXIBIR)
==============================
${promptGlobal}

==============================
📌 PROMPT ORIGINAL DO ESPORTE
==============================
${promptOriginal}

==============================
📌 ESTILO BETGRAM IA
==============================
- Títulos com emojis.
- Análise profunda e técnica.
- Probabilidades estimadas.
- Odds justas quando aplicável.
- Valor esperado quando aplicável.
- Cada mercado analisado separadamente.
- Conclusão clara.

Agora gere a análise COMPLETA.
`;
}

// ======================================================
// 🔥 3. FALLBACK GPT-5-mini
// ======================================================
async function gerarComGPT5(promptOriginal, promptGlobal) {
  try {
    console.log("🟠 Fallback → GPT-5-mini…");

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = montarPromptFallback(promptOriginal, promptGlobal);

    const completion = await client.chat.completions.create({
      model: "gpt-5-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 6000,
      temperature: 0.7,
    });

    return { ok: true, text: completion.choices[0].message.content };
  } catch (error) {
    console.log("❌ Erro no GPT-5-mini:", error.message);
    return { ok: false, error };
  }
}

// ======================================================
// 🔥 4. FALLBACK GPT-4o-mini
// ======================================================
async function gerarComGPT4(promptOriginal, promptGlobal) {
  try {
    console.log("🟡 Fallback → GPT-4o-mini…");

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = montarPromptFallback(promptOriginal, promptGlobal);

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 6000,
      temperature: 0.7,
    });

    return { ok: true, text: completion.choices[0].message.content };
  } catch (error) {
    console.log("❌ Erro no GPT-4o-mini:", error.message);
    return { ok: false, error };
  }
}

// ======================================================
// 🔥 5. ROTA PRINCIPAL
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

    // Gera as regras ocultas do global.js
    const promptGlobal = gerarContextoGlobal(confronto || "Confronto não informado");

    // 1️⃣ Gemini principal
    const gemini = await gerarComGemini(prompt);
    if (gemini.ok) {
      return NextResponse.json({
        content: gemini.text,
        fallback: false,
      });
    }

    console.log("⚠️ Gemini falhou — iniciando fallback…");

    // 2️⃣ Fallback GPT-5-mini
    const gpt5 = await gerarComGPT5(prompt, promptGlobal);
    if (gpt5.ok) {
      return NextResponse.json({
        content: gpt5.text,
        fallback: true,
      });
    }

    console.log("⚠️ GPT-5-mini falhou — tentando GPT-4o-mini…");

    // 3️⃣ Fallback GPT-4o-mini
    const gpt4 = await gerarComGPT4(prompt, promptGlobal);
    if (gpt4.ok) {
      return NextResponse.json({
        content: gpt4.text,
        fallback: true,
      });
    }

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

