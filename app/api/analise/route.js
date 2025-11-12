import "dotenv/config";
import OpenAI from "openai";

/**
 * API da Betgram IA — compatível com SDK 6.8.1 e modelos GPT-5
 * Usa o novo endpoint responses.create()
 */
export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
      return new Response(JSON.stringify({ error: "Prompt inválido." }), { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("❌ OPENAI_API_KEY ausente no ambiente Vercel.");
      return new Response(
        JSON.stringify({
          error: "Chave da OpenAI ausente. Configure nas variáveis do projeto.",
        }),
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey });

    console.log("🚀 Enviando prompt para GPT-5-mini-2025-08-07 via responses.create...");

    // ⚙️ Novo formato do SDK 6.x
    const response = await client.responses.create({
      model: "gpt-5-mini-2025-08-07",
      input: `Analise o confronto esportivo a seguir e gere uma previsão detalhada, considerando estatísticas e valor de odd:\n\n${prompt}`,
      max_output_tokens: 2000,
    });

    // 🔍 Coleta a resposta textual
    const resposta =
      response.output_text?.trim() ||
      response.output?.[0]?.content?.[0]?.text?.trim() ||
      "(sem resposta textual retornada)";

    console.log("✅ Resposta recebida:", resposta.slice(0, 150) + "...");

    return new Response(JSON.stringify({ resposta }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("🚨 Erro /api/analise:", err);
    const msg =
      err?.error?.message ||
      err?.response?.data?.error?.message ||
      err?.message ||
      "Falha ao gerar análise.";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
