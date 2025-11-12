import "dotenv/config";
import OpenAI from "openai";

/**
 * API interna que processa requisições da Betgram IA.
 * Roda no backend e tem acesso às variáveis .env.local
 */
export async function POST(req) {
  try {
    const { prompt } = await req.json();

    // 🧩 Verifica se o prompt é válido
    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
      return new Response(JSON.stringify({ error: "Prompt inválido." }), {
        status: 400,
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "OPENAI_API_KEY ausente no servidor (.env.local).",
        }),
        { status: 500 }
      );
    }

    // 🔑 Inicializa o cliente OpenAI
    const openai = new OpenAI({ apiKey });

    // 💬 Chama o GPT-4 mini
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // modelo rápido e econômico
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 3000,
    });

    const resposta =
      completion.choices?.[0]?.message?.content?.trim() || "Sem resposta.";

    return new Response(JSON.stringify({ resposta }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("🚨 Erro /api/analise:", err);
    return new Response(
      JSON.stringify({ error: "Falha ao gerar análise." }),
      { status: 500 }
    );
  }
}

