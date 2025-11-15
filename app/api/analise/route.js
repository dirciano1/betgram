import OpenAI from "openai";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "Prompt inválido" }, { status: 400 });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      // 🧠 ATIVA A PESQUISA NA INTERNET
      tools: [
        {
          type: "web_search",
          web_search: {
            engine: "google", // usa Google Search
          },
        },
      ],
      tool_choice: "auto", // deixa o modelo decidir quando pesquisar

      max_tokens: 3500,
      temperature: 0.4,
    });

    // Resposta final
    return Response.json({
      resposta: response.choices[0].message.content,
    });

  } catch (err) {
    console.error("Erro na API Betgram IA:", err);
    return Response.json(
      { error: "Erro interno ao gerar análise" },
      { status: 500 }
    );
  }
}
