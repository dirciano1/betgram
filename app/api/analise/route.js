// /app/api/analise/route.js
import OpenAI from "openai";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
      return new Response(JSON.stringify({ error: "Prompt inválido." }), { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "OPENAI_API_KEY ausente no servidor." }), { status: 500 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // 🔥 Agora sempre usa só o gpt-4o-mini
    const model = "gpt-4o-mini";

    const r = await openai.responses.create({
      model,
      input: [
        {
          role: "user",
          content: prompt,
        },
      ],

      // 🧠 PESQUISA NA INTERNET ATIVADA
      tools: [
        {
          type: "web_search",
          web_search: {
            engine: "google",
          },
        },
      ],
      tool_choice: "auto",

      max_output_tokens: 3000,
    });

    const texto = r.output_text?.trim();

    if (!texto) {
      throw new Error("Nenhum texto retornado do modelo.");
    }

    return new Response(
      JSON.stringify({ resposta: texto, modelo }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (err) {
    console.error("🚨 Erro /api/analise:", err);
    return new Response(
      JSON.stringify({ error: err?.message || "Falha ao gerar análise." }),
      { status: 500 }
    );
  }
}
