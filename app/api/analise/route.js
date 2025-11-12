import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
      return new Response(JSON.stringify({ error: "Prompt inválido." }), {
        status: 400,
      });
    }

    console.log("🔹 Iniciando requisição Gemini...");
    console.log("Prompt recebido:", prompt.substring(0, 100));

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `
Você é uma inteligência artificial com acesso à internet (Google Search).
Antes de responder, verifique informações atualizadas sobre o tema.
Confirme times, status de jogadores, resultados recentes e notícias atuais.
Evite respostas hipotéticas, e priorize fatos confirmados no momento da consulta.
      `,
    });

    const result = await model.generateContent(prompt);
    const resposta = result.response.text();

    console.log("✅ Resposta recebida com sucesso!");
    return new Response(JSON.stringify({ resposta }), { status: 200 });
  } catch (err) {
    console.error("❌ Erro interno na API Gemini:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Falha ao gerar análise." }),
      { status: 500 }
    );
  }
}
