import "dotenv/config";
import OpenAI from "openai";

/**
 * API da Betgram IA — agora usando o endpoint responses.create (compatível com GPT-5)
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
          error: "Chave da OpenAI ausente. Configure nas variáveis do projeto na Vercel.",
        }),
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    console.log("🧠 Enviando prompt via responses.create (GPT-5-mini-2025-08-07)...");

    // 🆕 Novo formato para GPT-5
    const respostaOpenAI = await openai.responses.create({
      model: "gpt-5-mini-2025-08-07",
      input: [
        {
          role: "user",
          content: `Analise o confronto esportivo a seguir com base em estatísticas, valor de odd e contexto recente:\n\n${prompt}`,
        },
      ],
      max_output_tokens: 2000,
    });

    const respostaTexto = respostaOpenAI.output_text?.trim() || "(sem resposta textual)";

    console.log("✅ Resposta da OpenAI:", respostaTexto.slice(0, 150) + "...");

    return new Response(JSON.stringify({ resposta: respostaTexto }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("🚨 Erro /api/analise:", err?.response?.data || err);
    const msg =
      err?.response?.data?.error?.message ||
      err?.message ||
      "Falha ao gerar análise.";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
