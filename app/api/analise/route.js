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

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: [{ googleSearch: {} }], // <-- googleSearch aqui!
    });

    const result = await model.generateContent({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    const resposta = result.response.text();

    return NextResponse.json({ content: resposta }, { status: 200 });
  } catch (error) {
    console.error("🔥 ERRO IA:", error);
    return NextResponse.json(
      { error: "Falha ao gerar análise: " + error.message },
      { status: 500 }
    );
  }
}
