// prompts/futsal.js
// 🔹 Módulo para gerar prompt de análise de Futsal (Liga Nacional, Copa do Mundo, UEFA Futsal, etc.)
// ✅ Compatível com API ChatGPT / OpenAI / Gemini e estrutura do BetGram

export function gerarPrompt(confronto, mercado, competicao, odd) {
  if (mercado) {
    // === Prompt ESPECÍFICO (mercado + odd opcional) ===
    return `ChatGPT, analise o mercado de ${mercado} para o confronto ${confronto} no Futsal, válido pela competição ${competicao || 'não especificada'}.
${odd ? `A odd oferecida é ${odd}. Avalie se essa odd representa bom valor ou está abaixo do ideal considerando estilo de jogo, força ofensiva e estatísticas recentes.` : ''}

Considere:
⚽ Média de gols marcados e sofridos por jogo de cada equipe;
🔥 Eficiência ofensiva (conversão de finalizações, média de chutes a gol);
🧱 Solidez defensiva e desempenho do goleiro (defesas por jogo, gols evitados);
📈 Desempenho recente (últimas 5 partidas e saldo de gols);
🏟️ Local do jogo (mandante x visitante) e influência do público;
🧠 Estilo tático (posse de bola, pressão alta, contra-ataque);
💪 Condição física e rotação do elenco (linhas curtas e tempo de quadra);
⏱️ Média de gols por tempo (1º tempo x 2º tempo);
📊 Aproveitamento em bolas paradas e power play (goleiro-linha);
👥 Confrontos diretos (head-to-head e placares médios anteriores).

Indique:
1. A probabilidade real estimada de o evento ocorrer;
2. A odd mínima justa para representar valor esperado positivo;
3. Uma recomendação de aposta e justificativa técnica e estatística;
4. Um mercado alternativo com bom valor esperado, se houver.`;
  } else {
    // === Prompt GERAL (todos os mercados) ===
    return `ChatGPT, analise todos os mercados de aposta disponíveis para o confronto ${confronto} no Futsal, válido pela competição ${competicao || 'não especificada'}.

Considere os principais grupos de mercado:

🏆 **Resultado / Moneyline**
- Vencedor da partida (1X2);
- Empate Anula Aposta;
- Dupla Chance (1X, X2, 12);
- Vitória por tempo (1º tempo / 2º tempo).

➖ **Handicap / Spread**
- Handicap Asiático (-1.5, +1.5);
- Handicap Europeu;
- Handicap por tempo (ex: -0.5 no 1º tempo);
- Vence por 2+ gols (Sim/Não).

🎯 **Totais (Over/Under)**
- Total de Gols da Partida (O/U 4.5, 5.5, 6.5);
- Total de Gols por Equipe (Team Totals);
- Total de Gols por Tempo;
- Ambas as equipes marcam (Sim/Não);
- Total de Gols Ímpar/Par.

💥 **Especiais e Props**
- Primeiro a marcar (Sim/Não);
- Último a marcar;
- Equipe marca em ambos os tempos (Sim/Não);
- Total de gols nos últimos 10 minutos;
- Vence com Clean Sheet (Sim/Não);
- Vence de virada (Sim/Não);
- Jogo vai para prorrogação (em eliminatórias).

📊 **Estatísticas de Equipe**
- Média de posse de bola;
- Número médio de finalizações;
- Média de gols em bolas paradas;
- Aproveitamento de power play (goleiro-linha);
- Número de cartões por jogo;
- Média de faltas cometidas e sofridas.

👥 **Aspectos Táticos**
- Estratégia ofensiva (pressão alta, giro de bola, pivô fixo);
- Eficiência defensiva e transições rápidas;
- Participação do goleiro-linha e timing de uso;
- Capacidade de reação após sair atrás no placar;
- Aproveitamento no 1º tempo e resistência no 2º;
- Adaptação a pisos diferentes (quadra rápida, emborrachada, madeira).

🧠 **Contexto e Situação**
- Importância do jogo (mata-mata, fase de grupos, final);
- Desgaste recente (jogos consecutivos, viagens);
- Clássicos e rivalidades locais;
- Desfalques e substituições;
- Momento psicológico (vitórias seguidas ou derrotas).

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

// 🔹 Exemplo de integração com API ChatGPT / OpenAI
export async function analisarFutsalAPI(confronto, mercado, competicao, odd, apiKey) {
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
        { role: "system", content: "Você é um analista esportivo especialista em Futsal e apostas esportivas." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 800,
    }),
  });

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "❌ Erro: resposta vazia da API.";
}
