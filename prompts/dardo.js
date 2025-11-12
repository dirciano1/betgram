// prompts/dardos.js
// 🔹 Módulo para gerar prompt de análise de Dardos (PDC, Premier League Darts, World Championship, etc.)
// ✅ Compatível com API ChatGPT / OpenAI e mesmo padrão dos outros esportes

export function gerarPrompt(confronto, mercado, competicao, odd) {
  if (mercado) {
    // === Prompt ESPECÍFICO (mercado + odd opcional) ===
    return `ChatGPT, analise o mercado de ${mercado} para o confronto ${confronto} no Dardos, válido pela competição ${competicao || 'não especificada'}.
${odd ? `A odd oferecida é ${odd}. Avalie se essa odd representa bom valor ou está abaixo do ideal considerando o desempenho recente dos jogadores, média de pontuação e precisão nos checkouts.` : ''}

Considere:
🎯 Média de pontuação por turno (3 dardos);
🔥 Frequência de 180s (máximos);
💪 Precisão de checkout (percentual de acerto nas duplas finais);
📊 Aproveitamento em legs decisivos e sets longos;
🧠 Fator psicológico e consistência sob pressão;
🏆 Histórico de confrontos diretos (head-to-head);
📈 Forma recente nas últimas competições;
⚙️ Estilo de jogo (agressivo ou cadenciado);
🕒 Ritmo e regularidade nas aberturas de leg (first nine average);
📍 Situação do torneio (fase de grupos, eliminatória ou final).

Indique:
1. A probabilidade real estimada de o evento ocorrer;
2. A odd mínima justa para representar valor esperado positivo;
3. Uma recomendação de aposta com justificativa técnica e estatística;
4. Um mercado alternativo com bom valor esperado, se houver.`;
  } else {
    // === Prompt GERAL (todos os mercados) ===
    return `ChatGPT, analise todos os mercados de aposta disponíveis para o confronto ${confronto} no Dardos, válido pela competição ${competicao || 'não especificada'}.

Considere os principais grupos de mercado:

🏆 **Resultado / Match Winner**
- Vencedor da Partida (Moneyline);
- Vencedor por Sets ou Legs;
- Empate (em formatos de Premier League);
- Vencedor de Set específico (ex: 1º set, 3º set).

➖ **Handicap / Spread**
- Handicap em Sets (ex: +1.5 / -1.5);
- Handicap em Legs;
- Margem de Vitória (1–2, 3–4, etc.);
- Resultado Exato (por sets ou legs).

🎯 **Totais (Over/Under)**
- Total de Sets (O/U);
- Total de Legs (O/U);
- Total de 180s na partida (O/U);
- Total de 180s por jogador;
- Total de Checkouts acima de 100 pontos (O/U);
- Total de Dardos para fechar um leg.

💥 **Especiais e Props**
- Jogador com maior número de 180s;
- Maior checkout da partida (O/U);
- Primeiro jogador a marcar 180;
- Jogador vence e tem maior checkout (Sim/Não);
- Jogador faz checkout perfeito (170);
- Algum 9-dart leg (Sim/Não).

📊 **Estatísticas Individuais**
- Média final de pontuação por jogador;
- Percentual de checkout (O/U 40%, 50%, etc.);
- Aproveitamento com a vantagem do saque;
- Diferença média entre as aberturas de leg;
- Melhor média de 3 dardos.

🧠 **Aspectos Técnicos e Psicológicos**
- Consistência sob pressão (legs decisivos);
- Histórico em finais e partidas longas;
- Desempenho contra oponentes canhotos ou destros;
- Motivação e ritmo recente (últimos 5 jogos);
- Táticas de ritmo (rápido/lento) e adaptação.

Para cada grupo, indique:
1. O mercado mais provável de sucesso;
2. A odd mínima justa para representar valor positivo;
3. A aposta principal com justificativa técnica e contextual;
4. Um mercado alternativo com bom valor esperado.

Finalize com um resumo destacando:
- 🟩 A aposta mais segura (alta probabilidade);
- 🟥 A aposta mais arriscada (alto potencial de retorno).`;
  }
}

// 🔹 Exemplo de integração com API ChatGPT
export async function analisarDardosAPI(confronto, mercado, competicao, odd, apiKey) {
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
        { role: "system", content: "Você é um analista esportivo especialista em dardos e apostas esportivas." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 800,
    }),
  });

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "❌ Erro: resposta vazia da API.";
}
