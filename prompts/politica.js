// prompts/politica.js
// 🔹 Módulo para gerar prompt de análise de apostas políticas (Eleições, Aprovação, Debates, Referendos, etc.)
// ✅ Compatível com API ChatGPT / OpenAI e estrutura modular do BetGram

export function gerarPrompt(confronto, mercado, competicao, odd) {
  if (mercado) {
    // === Prompt ESPECÍFICO (mercado + odd opcional) ===
    return `ChatGPT, analise o mercado de ${mercado} para o confronto ${confronto} no cenário político, relacionado ao evento ${competicao || 'não especificado'}.
${odd ? `A odd oferecida é ${odd}. Avalie se essa odd representa bom valor considerando o contexto político atual, as pesquisas, o histórico eleitoral e o sentimento popular.` : ''}

Considere:
🗳️ Tipo de eleição (presidencial, parlamentar, estadual, referendo, primária, etc.);
📊 Pesquisas eleitorais recentes e tendência de variação nas últimas semanas;
🧠 Perfil do eleitorado e taxa de indecisos;
🏛️ Histórico de desempenho do candidato/partido em eleições anteriores;
💬 Discurso, imagem pública e nível de rejeição;
💰 Financiamento de campanha e visibilidade na mídia;
🔥 Fatores externos: economia, inflação, desemprego, conflitos ou escândalos;
🌎 Influência regional e polarização política;
📈 Apoios, coligações e alianças estratégicas;
📉 Eventos recentes (debates, gafes, investigações, protestos, greves);
🕐 Tempo até a eleição e possíveis mudanças no cenário.

Indique:
1. A probabilidade real estimada de o evento ocorrer;
2. A odd mínima justa para representar valor esperado positivo;
3. Uma recomendação de aposta e justificativa baseada em tendências e dados;
4. Um cenário alternativo com bom valor esperado, se houver.`;
  } else {
    // === Prompt GERAL (todos os mercados) ===
    return `ChatGPT, analise todos os mercados de aposta disponíveis para o confronto ${confronto} no cenário político, relacionado ao evento ${competicao || 'não especificado'}.

Considere os principais grupos de mercado:

🏆 **Resultado / Vitória**
- Vencedor da eleição (Presidente, Governador, Primeiro-Ministro);
- Vencedor do 2º turno (Head-to-Head);
- Partido ou coligação vencedora;
- Maioria parlamentar (Câmara / Senado).

📈 **Popularidade e Aprovação**
- Taxa de aprovação do governo atual;
- Nível de rejeição do candidato;
- Net Approval Rating (diferença entre aprovação e reprovação);
- Tendência de crescimento/queda nas pesquisas.

📊 **Totais e Percentuais**
- Percentual de votos obtidos (Over/Under 45%, 50%, etc.);
- Margem de vitória (1-5%, 5-10%, etc.);
- Participação no 2º turno (Sim/Não);
- Voto em branco/nulo (percentual final).

⚔️ **Head-to-Head / Duelo Direto**
- Quem obtém mais votos (Candidato A x Candidato B);
- Quem vence em determinados estados/regiões;
- Melhor desempenho em debates televisivos;
- Crescimento em pesquisas entre rodadas.

🧭 **Eventos e Referendos**
- Aprovação de leis ou reformas (Sim/Não);
- Resultado de plebiscitos e referendos;
- Queda ou renúncia de líder político (Sim/Não);
- Moção de censura ou impeachment (Sim/Não);
- Adoção de novas políticas (Sim/Não).

🧠 **Fatores Contextuais**
- Situação econômica e inflação;
- Escândalos ou investigações em curso;
- Tendência de mídia e redes sociais;
- Influência internacional (EUA, UE, China, etc.);
- Endossos de figuras influentes (celebridades, partidos, igrejas).

Para cada grupo, indique:
1. O mercado mais provável de sucesso;
2. A odd mínima justa para representar valor positivo;
3. A aposta principal com justificativa baseada em dados e histórico;
4. Um mercado alternativo com bom valor esperado.

Finalize com um resumo destacando:
- 🟩 A aposta mais segura (alta probabilidade, baixa volatilidade);
- 🟥 A aposta mais arriscada (alto potencial de retorno, cenário volátil).`;
  }
}

// 🔹 Exemplo de integração via API ChatGPT / OpenAI
export async function analisarPoliticaAPI(confronto, mercado, competicao, odd, apiKey) {
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
        { role: "system", content: "Você é um analista político especializado em apostas eleitorais e probabilidades baseadas em dados de pesquisas, contexto e histórico." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 800,
    }),
  });

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "❌ Erro: resposta vazia da API.";
}
