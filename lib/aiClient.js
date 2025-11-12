import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
      return new Response(JSON.stringify({ error: "Prompt inválido." }), {
        status: 400,
      });
    }

    // inicializa o cliente do Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // seleciona o modelo Gemini 2.5 Flash com busca em tempo real
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: [{ googleSearch: {} }], // 🔍 ativa grounding
    });

    // gera a resposta
    const result = await model.generateContent(prompt);
    const resposta = result.response.text();

    return new Response(JSON.stringify({ resposta }), { status: 200 });
  } catch (err) {
    console.error("Erro interno na API:", err);
    return new Response(
      JSON.stringify({ error: "Falha ao gerar análise." }),
      { status: 500 }
    );
  }
}
