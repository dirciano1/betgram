import "dotenv/config";
import OpenAI from "openai";

/**
 * API interna que processa requisições da Betgram IA.
 * Roda no backend e tem acesso às variáveis .env.local
 */
export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
      return new Response(JSON.stringify({ error: "Prompt inválido." }), { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY ausente no servidor (.env.local)." }),
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // rápido e barato
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 2500,
    });

    const resposta = completion.choices?.[0]?.message?.content || "Sem resposta.";
    return Response.json({ resposta });
  } catch (err) {
    console.error("Erro /api/analise:", err);
    return new Response(JSON.stringify({ error: "Falha ao gerar análise." }), { status: 500 });
  }
}


