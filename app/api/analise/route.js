// app/api/analise/route.js
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { montarPromptFallback } from "@/lib/prompt-utils";
import { gerarPrompt } from "@/prompts/index"; // seu gerador (futebol, basquete etc.)

// =============================================
// 🔥 1) PRIMEIRA TENTATIVA → GEMINI + WEB SEARCH
// =============================================
async function gerarComGemini(promptOriginal, promptGlobal) {
  try {
    console.log("🟢 Gemini ativo…");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // pode trocar p/ pro se quiser
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: montarPromptFallback(promptOriginal, promptGlobal) }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 6000,
        temperature: 0.4, // ideal p/ buscas Betgram
      },
      tools: [{ googleSearch: {} }], // 🔥 ATIVA PESQUISA EM TEMPO REAL
    });

    const resposta = result.response.text();
    return { ok: true, text: resposta };

  } catch (error) {
    console.log("❌ Erro Gemini:", error.message);
    return { ok: false, error };
  }
}



// =============================================
// 🔥 2) SEGUNDA TENTATIVA → GPT-5-mini (SEM temperature)
// =============================================
async function gerarComGPT5(promptOriginal, promptGlobal) {
  try {
    console.log("🟠 Fallback → GPT-5-mini…");

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "user",
          content: montarPromptFallback(promptOriginal, promptGlobal),
        },
      ],
      max_completion_tokens: 6000,
      // ❌ sem temperature aqui
    });

    return { ok: true, text: completion.choices[0].message.content };

  } catch (error) {
    console.log("❌ Erro GPT-5-mini:", error.message);
    return { ok: false, error };
  }
}



// =============================================
// 🔥 3) TERCEIRA TENTATIVA → GPT-4o-mini (temperature 0.3)
// =============================================
async function gerarComGPT4(promptOriginal, promptGlobal) {
  try {
    console.log("🟡 Fallback → GPT-4o-mini…");

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: montarPromptFallback(promptOriginal, promptGlobal),
        },
      ],
      max_completion_tokens: 6000,
      temperature: 0.3, // ✔️ apenas no GPT-4
    });

    return { ok: true, text: completion.choices[0].message.content };

  } catch (error) {
    console.log("❌ Erro GPT-4o-mini:", error.message);
    return { ok: false, error };
  }
}



// =============================================
// 🚀 ROTA PRINCIPAL
// =============================================
export async function POST(request) {
  try {
    const { confronto, mercado, competicao, odd } = await request.json();

    // Gera o prompt principal do esporte escolhido
    const promptOriginal = gerarPrompt(confronto, mercado, competicao, odd);

    // 1️⃣ Tenta GEMINI
    const g1 = await gerarComGemini(promptOriginal, "");
    if (g1.ok) return NextResponse.json({ ok: true, text: g1.text });

    // 2️⃣ Tenta GPT-5-mini
    const g2 = await gerarComGPT5(promptOriginal, "");
    if (g2.ok) return NextResponse.json({ ok: true, text: g2.text });

    // 3️⃣ Tenta GPT-4o-mini (temperature 0.3)
    const g3 = await gerarComGPT4(promptOriginal, "");
    if (g3.ok) return NextResponse.json({ ok: true, text: g3.text });

    // Sem resposta de emergência, como você pediu
    return NextResponse.json({
      ok: false,
      error: "Nenhum dos modelos respondeu.",
    });

  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error.message,
    });
  }
}
