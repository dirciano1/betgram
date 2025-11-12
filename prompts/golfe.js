// prompts/golfe.js
// 🔹 Módulo para gerar prompt de análise de Golfe (PGA Tour, LIV, The Masters, etc.)
// ✅ Compatível com API ChatGPT / OpenAI e padrão modular do BetGram

export function gerarPrompt(confronto, mercado, competicao, odd) {
  if (mercado) {
    // === Prompt ESPECÍFICO (mercado + odd opcional) ===
    return `ChatGPT, analise o mercado de ${mercado} para o confronto ${confronto} no Golfe, válido pela competição ${competicao || 'não especificada'}.
${odd ? `A odd oferecida é ${odd}. Avalie se essa odd representa bom valor ou está abaixo do ideal considerando desempenho recente, tipo de campo e condições de jogo.` : ''}

Considere:
⛳ Tipo de torneio (Stroke Play, Match Play, 72 buracos, Major, etc.);
🌤️ Condições climáticas e impacto no campo (vento, umidade, chuva);
🏌️‍♂️ Tipo de campo e dificuldade (comprimento, green speed, rough, bunkers);
📊 Estatísticas recentes do jogador (fairways hit, greens in regulation, putts por rodada);
🔥 Forma recente (últimos torneios, top 10 finishes, consistência no corte);
🧠 Fator mental e desempenho em rodadas finais sob pressão;
💪 Força física e ritmo de jogo (resistência em torneios longos);
🧩 Histórico do jogador neste mesmo campo/torneio;
📈 Ranking mundial e desempenho contra rivais diretos;
🕒 Condição de início da rodada (tee time, vento da manhã/tarde).

Indique:
1. A probabilidade real estimada de o evento ocorrer;
2. A odd mínima justa para representar valor esperado positivo;
3. Uma recomendação de aposta e justificativa técnica e estatística;
4. Um mercado alternativo com bom valor esperado, se houver.`;
  } else {
    // === Prompt GERAL (todos os mercados) ===
    return `ChatGPT, analise todos os mercados de aposta disponíveis para o confronto ${confronto} no Golfe, válido pela competição ${competicao || 'não especificada'}.

Considere os principais grupos de mercado:

🏆 **Resultado / Moneyline**
- Vencedor do Torneio;
- Vencedor do Grupo (3-Ball ou 2-Ball);
- Vencedor da Rodada (1ª, 2ª, 3ª ou 4ª);
- Top 5 / Top 10 / Top 20 Finish;
- Empate (Dead Heat) e ajustes de ranking.

🎯 **Totais e Over/Under**
- Total de tacadas do jogador (Over/Under);
- Total de Birdies / Bogeys / Eagles;
- Pontuação média por rodada;
- Total de tacadas no 1º dia ou 1ª metade do torneio;
- Total de tacadas combinadas (parciais + finais).

⚔️ **Head-to-Head / Matchups**
- Quem termina com melhor pontuação (Jogador A x Jogador B);
- Handicap entre jogadores (-1.5 tacadas, +2.5 tacadas);
- Empate incluído ou devolvido;
- Resultado por rodadas específicas.

💥 **Especiais e Props**
- Jogador lidera após 1ª rodada (Sim/Não);
- Líder após 36 ou 54 buracos;
- Jogador faz hole-in-one (Sim/Não);
- Score mais baixo da rodada (Sim/Não);
- Jogador vence sem ir para playoff;
- Empate em 1º lugar (Sim/Não);
- Nacionalidade do vencedor (EUA, Europa, Ásia, etc.);
- Jogador vence o torneio pela 1ª vez.

📊 **Estatísticas e Indicadores**
- Greens in Regulation (GIR %);
- Fairways acertados (Fairway Hit %);
- Putting Average;
- Sand Save % (saídas de bunker);
- Driving Distance (distância média de tacadas);
- Scrambling % (recuperação após erro).

🧠 **Aspectos Estratégicos**
- Adaptação ao campo (comprimento, greens rápidos, vento);
- Estilo de jogo (agressivo, controle, técnico);
- Forma física e mental (viagens, sequência de torneios);
- Clima e condição do campo ao longo dos dias;
- Histórico do jogador neste mesmo torneio;
- Pressão da liderança ou necessidade de recuperação.

Para cada grupo, indique:
1. O mercado mais provável de sucesso;
2. A odd mínima justa para representar valor positivo;
3. A aposta principal com justificativa técnica e contextual;
4. Um mercado alternativo de valor, se existir.

Finalize com um resumo destacando:
- 🟩 A aposta mais segura (alta probabilidade);
- 🟥 A aposta mais arriscada (alto potencial de retorno).`;
  }
}

// 🔹 Exemplo de integração com API ChatGPT / OpenAI
export async function analisarGolfeAPI(confronto, mercado, competicao, odd, apiKey) {
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
        { role: "system", content: "Você é um analista esportivo especializado em Golfe e apostas esportivas." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 800,
    }),
  });

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "❌ Erro: resposta vazia da API.";
}
