import "dotenv/config";
import OpenAI from "openai";

/**
 * API da Betgram IA — usando GPT-5-mini-2025-08-07 (mais completo e ainda econômico)
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
        JSON.stringify({ error: "Chave da OpenAI ausente. Configure nas variáveis da Vercel." }),
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    console.log("🔄 Enviando prompt ao GPT-5-mini-2025-08-07…");

    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini-2025-08-07",
      messages: [
        {
          role: "system",
          content:
            "Você é a Betgram IA — especialista em análises esportivas e apostas de valor. Dê respostas objetivas e fundamentadas.",
        },
        { role: "user", content: prompt },
      ],
      max_completion_tokens: 2000,
    });

    const resposta =
      completion.choices?.[0]?.message?.content?.trim() ||
      "(sem texto retornado pelo modelo)";

    console.log("✅ Resposta recebida:", resposta.slice(0, 150) + "...");

    return new Response(JSON.stringify({ resposta }), {
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
