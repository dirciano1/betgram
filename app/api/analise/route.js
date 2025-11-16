// app/api/analise/route.js
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
      return NextResponse.json({ error: "Prompt inválido." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY não configurada" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Modelo com web search
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // Formato CORRETO
    const result = await model.generateContent({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      tools: [
        {
          googleSearch: {}
        }
      ]
    });

    const resposta = result.response.text();

    return NextResponse.json({ content: resposta });

  } catch (err) {
    console.error("Erro ao gerar análise:", err);
    return NextResponse.json(
      { error: err?.message || "Erro desconhecido" },
      { status: 500 }
    );
  }
}
