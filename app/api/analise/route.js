import "dotenv/config";
import OpenAI from "openai";

/**
 * API da Betgram IA — fallback automático entre GPT-5-nano e GPT-5-mini.
 * Garante resposta mesmo que o modelo nano retorne vazio.
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

    // 🔹 Função auxiliar para tentar um modelo e retornar resposta
    const gerarComModelo = async (modelo) => {
      console.log(`🧠 Gerando análise com ${modelo}...`);
      const completion = await openai.chat.completions.create({
        model: modelo,
        messages: [
          {
            role: "system",
            content:
              "Você é a Betgram IA — analista esportivo profissional. Gere previsões e análises claras e objetivas sobre apostas esportivas.",
          },
          { role: "user", content: prompt },
        ],
        max_completion_tokens: 2500,
      });

      return completion.choices?.[0]?.message?.content?.trim() || "";
    };

    // 🧠 1ª tentativa com GPT-5-nano
    let resposta = await gerarComModelo("gpt-5-nano-2025-08-07");

    // 🔁 Se o modelo nano não gerar nada, tenta o mini
    if (!resposta || resposta.length < 3) {
      console.warn("⚠️ Nano retornou vazio — tentando gpt-5-mini-2025-08-07...");
      resposta = await gerarComModelo("gpt-5-mini-2025-08-07");
    }

    // 🔚 Se mesmo assim não houver resposta, informa
    if (!resposta) resposta = "(sem resposta gerada pelos modelos)";

    console.log("✅ Resposta final:", resposta.slice(0, 120) + "...");

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
