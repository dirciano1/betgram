// prompts/snooker.js
// 🔹 Módulo para gerar prompt de análise de Snooker (World Snooker Tour, Masters, UK Championship, etc.)
// ✅ Compatível com API ChatGPT / OpenAI e estrutura modular do BetGram

export function gerarPrompt(confronto, mercado, competicao, odd) {
  if (mercado) {
    // === Prompt ESPECÍFICO (mercado + odd opcional) ===
    return `ChatGPT, analise o mercado de ${mercado} para o confronto ${confronto} no Snooker, válido pela competição ${competicao || 'não especificada'}.
${odd ? `A odd oferecida é ${odd}. Avalie se essa odd representa bom valor ou está abaixo do ideal considerando forma recente, consistência e histórico dos jogadores.` : ''}

Considere:
🎱 Forma recente dos jogadores (últimos torneios e aproveitamento);
📈 Taxa de vitórias por partida e por frame;
💪 Média de tacadas altas (50+, 100+ breaks);
🧠 Controle mental e desempenho sob pressão (frames decisivos);
🕒 Ritmo de jogo e estilo (agressivo, estratégico, defensivo);
🎯 Aproveitamento em bolas longas e tacadas de segurança;
🏆 Experiência em competições grandes (Masters, Worlds, UK Championship);
📊 Histórico do confronto direto (H2H) e resultados médios;
🧩 Fatores externos (viagens, fadiga, clima, ambiente da arena).

Indique:
1. A probabilidade real estimada de o evento ocorrer;
2. A odd mínima justa para representar valor esperado positivo;
3. Uma recomendação de aposta e justificativa técnica e estatística;
4. Um mercado alternativo com bom valor esperado, se houver.`;
  } else {
    // === Prompt GERAL (todos os mercados) ===
    return `ChatGPT, analise todos os mercados de aposta disponíveis para o confronto ${confronto} no Snooker, válido pela competição ${competicao || 'não especificada'}.

Considere os principais grupos de mercado:

🏆 **Resultado / Moneyline**
- Vencedor da Partida (Head-to-Head);
- Vencedor por Handicap de Frames (-1.5, +2.5, etc.);
- Vitória com margens exatas (ex: 6x4, 10x8);
- Vitória do 1º Frame;
- Resultado final exato (Best of 9, 11, 19).

🎯 **Totais (Over/Under)**
- Total de Frames Jogados (O/U 8.5, 9.5);
- Total de Century Breaks na partida;
- Total de Breaks 50+;
- Total de pontos no 1º Frame;
- Duração total (minutos ou número médio de tacadas).

💥 **Especiais e Props**
- Jogador faz Century Break (Sim/Não);
- Jogador faz o maior break da partida;
- Primeiro Century Break (quem marca primeiro);
- Frame vai à decisão final (Sim/Não);
- Jogo vai ao Frame Decisivo (Sim/Não);
- Jogador vence sem perder frame (Clean Sweep);
- Empate parcial durante o jogo (Sim/Não).

📊 **Estatísticas e Indicadores**
- Aproveitamento de bolas longas (%);
- Eficiência em safety shots;
- Média de pontos por visita à mesa;
- Percentual de conversão em frames com vantagem inicial;
- Média de erros não forçados.

🧠 **Aspectos Técnicos e Contextuais**
- Estilo de jogo (tático x ofensivo);
- Pressão psicológica (valendo título ou ranking);
- Experiência em eventos televisionados;
- Adaptação ao formato (Best of 7, 9, 11, 19, 35);
- Histórico de recuperação após sair atrás;
- Ambiente e importância do torneio (fase inicial, semifinal, final).

Para cada grupo, indique:
1. O mercado mais provável de sucesso;
2. A odd mínima justa para representar valor positivo;
3. A aposta principal com justificativa técnica e contextual;
4. Um mercado alternativo de valor.

Finalize com um resumo destacando:
- 🟩 A aposta mais segura (alta probabilidade);
- 🟥 A aposta mais arriscada (alto potencial de retorno).`;
  }
}

// 🔹 Exemplo de integração via API ChatGPT / OpenAI
export async function analisarSnookerAPI(confronto, mercado, competicao, odd, apiKey) {
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
        { role: "system", content: "Você é um analista esportivo especializado em Snooker e apostas esportivas." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 800,
    }),
  });

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "❌ Erro: resposta vazia da API.";
}
