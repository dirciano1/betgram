// app/api/analise/route.js
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || prompt.trim().length < 3) {
      return NextResponse.json(
        { error: "Prompt inválido." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY não configurada." },
        { status: 500 }
      );
    }

    // Inicializa SDK CORRETO
    const ai = new GoogleGenerativeAI(apiKey);

    // Modelo + ferramenta de busca ativada
    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: [{ googleSearch: {} }], // Search aqui!
    });

    // Estrutura correta para o Gemini
    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const text = response.response.text() || "Sem resposta.";

    return NextResponse.json({ content: text });
  } catch (error) {
    console.error("🔥 ERRO GERAL:", error);
    return NextResponse.json(
      { error: error.message || "Erro desconhecido" },
      { status: 500 }
    );
  }
}
