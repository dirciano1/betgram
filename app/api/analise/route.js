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

    // Tenta o mais novo e recua para os anteriores se necessário
    const modelos = [
      "gpt-5-mini-2025-08-07",
      "gpt-5-mini",
      "gpt-4o-mini"
    ];

    let resposta = null;
    let usado = null;
    let ultimoErro = null;

    for (const model of modelos) {
      try {
        const r = await openai.responses.create({
          model,
          // Use a nova Responses API (nada de temperature / max_tokens antigos)
          input: prompt,
          max_output_tokens: 1200, // ajuste se quiser respostas mais longas/curtas
        });

        // Helper do SDK v6: r.output_text retorna todo o texto já concatenado
        const texto = r.output_text?.trim();
        if (texto) {
          resposta = texto;
          usado = model;
          break;
        }
      } catch (e) {
        ultimoErro = e;
        // tenta o próximo modelo
      }
    }

    if (!resposta) {
      throw ultimoErro || new Error("Sem resposta do modelo.");
    }

    return new Response(JSON.stringify({ resposta, modelo: usado }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("🚨 Erro /api/analise:", err);
    return new Response(JSON.stringify({ error: err?.message || "Falha ao gerar análise." }), { status: 500 });
  }
}
