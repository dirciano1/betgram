import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
      return new Response(JSON.stringify({ error: "Prompt inválido." }), {
        status: 400,
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // modelo com busca (grounding)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: [{ googleSearch: {} }], // 🔍 ativa a pesquisa real
    });

    // Forçamos o modelo a buscar antes de responder
    const fullPrompt = `
Você é um analista esportivo com acesso à internet via Google Search.
Use o Google Search para confirmar informações atualizadas antes de responder.
Em especial, confirme times, escalações e status de jogadores.
Depois, siga o prompt abaixo normalmente:

${prompt}
`;

    const result = await model.generateContent(fullPrompt);
    const resposta = result.response.text();

    return new Response(JSON.stringify({ resposta }), { status: 200 });
  } catch (err) {
    console.error("Erro interno na API:", err);
    return new Response(
      JSON.stringify({ error: "Falha ao gerar análise." }),
      { status: 500 }
    );
  }
}
