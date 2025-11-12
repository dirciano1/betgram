import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * API da Betgram IA usando Gemini 2.5 Flash Lite
 */
export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
      return new Response(JSON.stringify({ error: "Prompt inválido." }), {
        status: 400,
      });
    }

    // Inicializa o cliente Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // Gera a resposta
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return new Response(JSON.stringify({ resposta: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("🚨 Erro na análise:", err);
    return new Response(
      JSON.stringify({ error: "Falha ao gerar análise." }),
      { status: 500 }
    );
  }
}
