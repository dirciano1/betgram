import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * API da Betgram IA usando Gemini 2.5 Flash
 */
export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
      return new Response(JSON.stringify({ error: "Prompt inválido." }), {
        status: 400,
      });
    }

    // Inicializa o cliente Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Mudança de modelo: "gemini-2.5-flash-lite" não suporta ferramentas como a Pesquisa Google.
    // Usaremos o modelo "gemini-2.5-flash", que é o ideal para grounding e busca.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // ➡️ NOVO: Objeto de configuração para ativar a ferramenta de pesquisa
    const config = {
      tools: [{ googleSearch: {} }],
    };

    // Gera a resposta, passando o prompt e a configuração
    const result = await model.generateContent({
      contents: prompt,
      config: config, // <--- AQUI é onde você ativa a busca
    });
    
    const text = result.response.text;
    
    // Opcional: Você pode incluir as citações/fontes na sua resposta
    // const citations = result.response.candidates[0]?.groundingMetadata?.webSearchQueries ?? [];

    return new Response(JSON.stringify({ resposta: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("🚨 Erro na análise:", err);
    return new Response(
      JSON.stringify({ error: "Falha ao gerar análise." }),
      { status: 500 }
    );
  }
}
