import "dotenv/config";
import OpenAI from "openai";

/**
 * API interna da Betgram IA — usa GPT-5-nano-2025-08-07.
 * Corrigido para compatibilidade total (sem temperature).
 */
export async function POST(req) {
  try {
    const { prompt } = await req.json();

    // 🧠 Validação do prompt
    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
      return new Response(
        JSON.stringify({ error: "Prompt inválido. Envie um texto mais detalhado." }),
        { status: 400 }
      );
    }

    // 🔑 Recupera a chave
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("❌ Variável OPENAI_API_KEY ausente no ambiente Vercel.");
      return new Response(
        JSON.stringify({
          error: "Chave da OpenAI ausente. Verifique as variáveis no painel da Vercel.",
        }),
        { status: 500 }
      );
    }

    // 🚀 Inicializa o cliente
    const openai = new OpenAI({ apiKey });

    console.log("✅ Conectado à OpenAI — gerando análise com GPT-5-nano-2025-08-07...");

    // 💬 Criação da resposta (sem 'temperature')
    const completion = await openai.chat.completions.create({
      model: "gpt-5-nano-2025-08-07",
      messages: [
        {
          role: "system",
          content:
            "Você é a Betgram IA — uma inteligência esportiva especialista em apostas e análises de valor.",
        },
        { role: "user", content: prompt },
      ],
      max_completion_tokens: 2500, // ✅ parâmetro correto
    });

    const resposta = completion.choices?.[0]?.message?.content?.trim() || "Sem resposta gerada.";

    console.log("✅ Resposta gerada:", resposta.slice(0, 120) + "...");

    return new Response(JSON.stringify({ resposta }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("🚨 Erro completo /api/analise:", err?.response?.data || err);

    const mensagemErro =
      err?.response?.data?.error?.message ||
      err?.message ||
      "Falha ao gerar análise. Tente novamente mais tarde.";

    return new Response(JSON.stringify({ error: mensagemErro }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
