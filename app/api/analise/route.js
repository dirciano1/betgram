import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * API da Betgram IA usando Gemini 2.5 Flash com tentativa de busca (quando disponível)
 */
export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
      return new Response(JSON.stringify({ error: "Prompt inválido." }), {
        status: 400,
      });
    }

    // 🔑 Inicializa o cliente Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // ⚙️ Modelo configurado com ferramentas (se habilitado no projeto)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: [{ googleSearch: {} }], // este campo é ignorado se o recurso não estiver ativo
    });

    // 🧠 Prompt com instrução de busca e contexto
    const fullPrompt = `
Você é um analista esportivo com acesso à internet.
Antes de responder, pesquise informações atuais sobre times, jogadores e contexto do confronto.
Evite respostas hipotéticas; baseie-se em dados reais e atualizados.
---
${prompt}
`;

    // 🧩 Gera o conteúdo
    const result = await model.generateContent(fullPrompt);
    const resposta = result.response.text();

    // ✅ Retorna resposta JSON
    return new Response(JSON.stringify({ resposta }), {
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
