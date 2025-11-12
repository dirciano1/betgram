// prompts/entretenimento.js
// 🔹 Módulo para gerar prompt de análise de apostas em Entretenimento
// (Oscar, Grammy, Big Brother, Eurovision, Reality Shows, Prêmios de TV e Cultura Pop)
// ✅ Compatível com integração via API ChatGPT / OpenAI

export function gerarPrompt(confronto, mercado, competicao, odd) {
  if (mercado) {
    // === Prompt ESPECÍFICO (mercado + odd opcional) ===
    return `ChatGPT, analise o mercado de ${mercado} para o evento ${confronto} no segmento de entretenimento, relacionado à competição ou programa ${competicao || 'não especificada'}.
${odd ? `A odd oferecida é ${odd}. Avalie se essa odd representa bom valor considerando popularidade, histórico e contexto atual do evento.` : ''}

Considere:
🎬 Tipo de evento (Reality Show, Prêmio de Cinema, Música, TV, Eurovision, etc.);
⭐ Popularidade e engajamento do participante/artista nas redes sociais;
🏆 Histórico de vitórias ou indicações anteriores;
📊 Tendências de votos e favoritismo nas enquetes ou mídia especializada;
💬 Opinião pública e percepção do público-alvo (críticos x fãs);
📈 Evolução do desempenho durante a competição ou temporada;
🧠 Estratégia e narrativa construída pelo participante (carisma, storyline, impacto emocional);
🕒 Contexto atual (eliminação recente, polêmicas, favoritismo, etc.);
🌎 Influência regional (países, fandoms, impacto de redes sociais e votos internacionais);
💥 Probabilidade de viradas ou surpresas de última hora.

Indique:
1. A probabilidade real estimada de o evento ocorrer;
2. A odd mínima justa para representar valor esperado positivo;
3. Uma recomendação de aposta e justificativa baseada em análise de popularidade e tendência;
4. Um cenário alternativo com bom valor esperado (aposta ousada).`;
  } else {
    // === Prompt GERAL (todos os mercados) ===
    return `ChatGPT, analise todos os mercados de aposta disponíveis para o evento ${confronto}, no segmento de entretenimento, referente à competição ou programa ${competicao || 'não especificada'}.

Considere os principais grupos de mercado:

🏆 **Vencedor / Resultado Principal**
- Vencedor Geral (por votação popular ou júri);
- Vencedor de categoria específica (Melhor Filme, Melhor Cantor, Melhor Reality, etc.);
- Eliminado da Semana (em realities como Big Brother, A Fazenda, Survivor, etc.);
- Finalistas e Top 3.

🎯 **Totais e Probabilidades**
- Total de prêmios recebidos (Oscar, Grammy, etc.);
- Total de nomeações convertidas em vitórias;
- Número de eliminações femininas/masculinas (em realities);
- Duração restante do participante no programa (O/U semanas).

💬 **Tendências e Mídia**
- Favorito nas enquetes e redes sociais;
- Participante mais mencionado positivamente;
- Participante mais polêmico (buzz effect);
- Evolução de votos semana a semana;
- Crescimento de seguidores e engajamento digital.

👥 **Head-to-Head / Duelos**
- Quem dura mais no reality (Participante A x Participante B);
- Quem tem mais votos positivos em uma rodada;
- Quem vence determinada categoria (Artista A x Artista B);
- Quem recebe mais prêmios no evento.

💥 **Especiais**
- Virada de favorito (Sim/Não);
- Participante eliminado com recorde de rejeição (Sim/Não);
- Empate entre finalistas (Sim/Não);
- Performance ao vivo mais votada (Sim/Não);
- Prêmio surpresa (Wildcard ou Menção Honrosa).

📊 **Critérios e Contexto**
- Engajamento social e fandoms ativos;
- Campanhas de marketing ou apelos emocionais;
- Críticas especializadas (Rotten Tomatoes, IMDB, Metacritic, etc.);
- Clima político, social ou cultural que influencia votos;
- Trajetória do evento e comparações com edições anteriores.

Para cada grupo, indique:
1. O mercado mais provável de sucesso;
2. A odd mínima justa para representar valor positivo;
3. A aposta principal com justificativa contextual e estatística;
4. Um mercado alternativo com valor e probabilidade interessante.

Finalize com um resumo destacando:
- 🟩 A aposta mais segura (baseada em favoritismo consolidado);
- 🟥 A aposta mais arriscada (alto potencial de retorno e imprevisibilidade).`;
  }
}

// 🔹 Exemplo de integração via API (ChatGPT / OpenAI)
export async function analisarEntretenimentoAPI(confronto, mercado, competicao, odd, apiKey) {
  const prompt = gerarPrompt(confronto, mercado, competicao, odd);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é um analista de cultura pop e apostas em entretenimento, com foco em probabilidades baseadas em tendências e popularidade." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 800,
    }),
  });

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "❌ Erro: resposta vazia da API.";
}
