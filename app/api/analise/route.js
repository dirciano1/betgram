import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    console.log("🔹 PROMPT recebido:", prompt?.slice(0, 100));

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
      console.log("⚠️ Prompt inválido.");
      return new Response(JSON.stringify({ error: "Prompt inválido." }), { status: 400 });
    }

    console.log("🔹 Iniciando conexão com Gemini...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    console.log("🔹 Instanciando modelo...");
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: [{ googleSearch: {} }],
    });

    console.log("🔹 Enviando prompt para Gemini...");
    const result = await model.generateContent(prompt);

    console.log("✅ Resposta recebida do Gemini!");
    const resposta = result.response.text();
    console.log("🧩 Texto final:", resposta?.slice(0, 100));

    return new Response(JSON.stringify({ resposta }), { status: 200 });
  } catch (err) {
    console.error("🚨 Erro interno Gemini:", err);
    return new Response(
      JSON.stringify({
        error: err.message || "Falha ao gerar análise.",
        detalhes: JSON.stringify(err, null, 2),
      }),
      { status: 500 }
    );
  }
}
