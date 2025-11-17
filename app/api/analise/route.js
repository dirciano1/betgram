// app/api/analise/route.js
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

// =========================
// 🔥 Função GEMINI com retry
// =========================
async function gerarComGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenerativeAI(apiKey);

  const model = ai.getGenerativeModel({
    model: "gemini-2.5-flash",
    tools: [{ googleSearch: {} }], // Mantém a pesquisa em tempo real
  });

  const maxTentativas = 3;

  for (let i = 0; i < maxTentativas; i++) {
    try {
      console.log(`🔎 Gemini tentativa ${i + 1}/${maxTentativas}...`);
      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const text = response.response.text();
      if (!text) throw new Error("Resposta vazia do Gemini");

      return { ok: true, text };
    } catch (error) {
      // Se for erro 503 (overload) → retry
      if (error.status === 503 || error.message.includes("overloaded")) {
        console.log("⚠️ Gemini sobrecarregado. Tentando novamente...");
        await new Promise((res) => setTimeout(res, 1200));
        continue;
      }

      console.log("❌ Erro no Gemini:", error.message);
      return { ok: false, error };
    }
  }

  return { ok: false, error: new Error("Gemini falhou após retries") };
}

// =========================
// 🔥 Fallback para GPT-4o-mini
// =========================
async function gerarComGPT(prompt) {
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log("🟡 Usando fallback GPT-4o-mini...");

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 3500,
      temperature: 0.6,
    });

    return { ok: true, text: completion.choices[0].message.content };
  } catch (error) {
    console.log("❌ Erro no GPT-4 fallback:", error.message);
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
      return NextResponse.json(
        { error: "Prompt inválido." },
        { status: 400 }
      );
    }

    // 1️⃣ Tentar com Gemini
    const geminiResult = await gerarComGemini(prompt);

    if (geminiResult.ok) {
      return NextResponse.json({ content: geminiResult.text });
    }

    console.log("⚠️ Gemini falhou. Indo para fallback GPT-4o-mini...");

    // 2️⃣ Fallback GPT-4o-mini
    const fallback = await gerarComGPT(prompt);

    if (fallback.ok) {
      return NextResponse.json({
        content:
          "⚠️ *Aviso*: O sistema principal estava instável, então usamos um modelo alternativo.\n\n" +
          fallback.text,
      });
    }

    // 3️⃣ Nada funcionou → erro final
    console.log("🔥 Nenhum modelo respondeu.");
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
