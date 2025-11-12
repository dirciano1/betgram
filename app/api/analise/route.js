import "dotenv/config";
import OpenAI from "openai";

/**
 * API interna que processa requisições da Betgram IA.
 * Utiliza GPT-5-nano-2025-08-07 (rápido e econômico).
 * Possui tratamento detalhado de erros e logs de diagnóstico.
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

    // 🔑 Recupera a chave da OpenAI do ambiente
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

    // 🚀 Inicializa o cliente OpenAI
    const openai = new OpenAI({ apiKey });

    console.log("✅ Conectado à OpenAI, gerando resposta com GPT-5-nano-2025-08-07...");

    // 💬 Cria a conclusão
    const completion = await openai.chat.completions.create({
      model: "gpt-5-nano-2025-08-07", // 🔹 Modelo liberado e leve
      messages: [
        {
          role: "system",
          content:
            "Você é a Betgram IA — uma inteligência esportiva especialista em apostas e análises de valor.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 2500,
    });

    const resposta = completion.choices?.[0]?.message?.content?.trim() || "Sem resposta gerada.";

    console.log("✅ Resposta gerada com sucesso:", resposta.slice(0, 120) + "...");

    return new Response(JSON.stringify({ resposta }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    // 🔍 Log de erro detalhado para depuração
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
