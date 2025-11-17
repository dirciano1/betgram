// app/api/analise/route.js
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

// =========================
// 🔥 Função GEMINI (principal) – sem NENHUMA alteração
// =========================
async function gerarComGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenerativeAI(apiKey);

  const model = ai.getGenerativeModel({
    model: "gemini-2.5-flash",
    tools: [{ googleSearch: {} }], // Pesquisa REAL ⚡
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
        await new Promise(res => setTimeout(res, 1200));
        continue;
      }

      console.log("❌ Erro no Gemini:", error.message);
      return { ok: false, error };
    }
  }

  return { ok: false, error: new Error("Gemini falhou após retries") };
}

// =========================
// 🔥 PROMPT EXTRA PARA FALLBACK (texto grande estilo Gemini)
// =========================
function montarPromptFallback(promptOriginal) {
  return `
INSTRUÇÕES IMPORTANTES (MODO FALLBACK):

Você NÃO tem acesso à internet.  
Portanto, gere uma análise EXTREMAMENTE COMPLETA e DETALHADA, 
seguindo rigorosamente o padrão da Betgram IA.

📌 O texto DEVE ter NO MÍNIMO **600 palavras**.
📌 Analise SEMPRE TODOS os mercados listados abaixo:

- Resultado Final (1X2)
- Over/Under 2.5 gols
- Ambas Marcam (BTTS)
- Escanteios (Over/Under)
- Cartões (Over/Under)
- Valor Esperado (EV)
- Odds justas
- Conclusões detalhadas para CADA mercado

Siga o estilo visual da Betgram IA:
- Títulos com emojis
- Destaques com cores (não coloque tags HTML)
- Explicações passo a passo
- Probabilidades estimadas
- Recomendações claras

⚠ Ignore completamente a falta de dados reais.  
Use estatísticas TÍPICAS dos times, padrões ofensivos/defensivos e 
conhecimento geral do futebol para estimar médias.

AGORA RESPONDA COM BASE NO PROMPT ORIGINAL:

"${promptOriginal}"
`;
}

// =========================
// 🔥 Fallback 1 — GPT-5-mini
// =========================
async function gerarComGPT5(promptOriginal) {
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    console.log("🟠 Fallback → GPT-5-mini…");

    const prompt = montarPromptFallback(promptOriginal);

    const completion = await client.chat.completions.create({
      model: "gpt-5-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 5000,
      temperature: 0.7,
    });

    return { ok: true, text: completion.choices[0].message.content };
  } catch (error) {
    console.log("❌ Erro no GPT-5-mini:", error.message);
    return { ok: false, error };
  }
}

// =========================
// 🔥 Fallback 2 — GPT-4o-mini
// =========================
async function gerarComGPT4(promptOriginal) {
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    console.log("🟡 Fallback → GPT-4o-mini…");

    const prompt = montarPromptFallback(promptOriginal);

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 5000,
      temperature: 0.7,
    });

    return { ok: true, text: completion.choices[0].message.content };
  } catch (error) {
    console.log("❌ Erro no GPT-4o-mini:", error.message);
    return { ok: false, error };
  }
}

// =========================
// 🔥 ROTA PRINCIPAL
// =========================
export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || prompt.trim().length < 3) {
      return NextResponse.json({ error: "Prompt inválido." }, { status: 400 });
    }

    // 1️⃣ GEMINI (principal)
    const gemini = await gerarComGemini(prompt);
    if (gemini.ok) {
      return NextResponse.json({ content: gemini.text, fallback: false });
    }

    console.log("⚠️ Gemini falhou — fallback para GPT-5-mini.");

    // 2️⃣ FALLBACK GPT-5
    const gpt5 = await gerarComGPT5(prompt);
    if (gpt5.ok) {
      return NextResponse.json({ content: gpt5.text, fallback: true });
    }

    console.log("⚠️ GPT-5-mini falhou — fallback para GPT-4o-mini.");

    // 3️⃣ FALLBACK GPT-4
    const gpt4 = await gerarComGPT4(prompt);
    if (gpt4.ok) {
      return NextResponse.json({ content: gpt4.text, fallback: true });
    }

    // 4️⃣ Nada funcionou
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

