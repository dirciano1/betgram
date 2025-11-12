// prompts/handebol.js
// 🔹 Módulo para gerar prompt de análise de Handebol (Ligas Europeias, Seleções, Olimpíadas, etc.)
// ✅ Compatível com API ChatGPT / OpenAI e estrutura modular do BetGram

export function gerarPrompt(confronto, mercado, competicao, odd) {
  if (mercado) {
    // === Prompt ESPECÍFICO (mercado + odd opcional) ===
    return `ChatGPT, analise o mercado de ${mercado} para o confronto ${confronto} no Handebol, válido pela competição ${competicao || 'não especificada'}.
${odd ? `A odd oferecida é ${odd}. Avalie se essa odd representa bom valor ou está abaixo do ideal considerando o ritmo ofensivo, desempenho defensivo e contexto da partida.` : ''}

Considere:
🤾‍♂️ Média de gols marcados e sofridos por jogo por ambas as equipes;
🔥 Eficiência ofensiva (taxa de conversão de arremessos e contra-ataques);
🧱 Solidez defensiva e desempenho dos goleiros (defesas por jogo, % de aproveitamento);
📈 Desempenho recente (últimos 5 jogos e saldo de gols);
🏟️ Vantagem de jogar em casa e impacto da torcida;
🧠 Ritmo de jogo e variação tática (transições rápidas, 7x6, trocas defensivas);
💪 Condição física e rotação do elenco (mudanças de linha e resistência);
📊 Desempenho por tempo (1º tempo x 2º tempo);
🧩 Aproveitamento em superioridade numérica (exclusões de 2 min);
👥 Confrontos diretos (head-to-head e média de gols históricos).

Indique:
1. A probabilidade real estimada de o evento ocorrer;
2. A odd mínima justa para representar valor esperado positivo;
3. Uma recomendação de aposta e justificativa técnica e estatística;
4. Um mercado alternativo com bom valor esperado, se houver.`;
  } else {
    // === Prompt GERAL (todos os mercados) ===
    return `ChatGPT, analise todos os mercados de aposta disponíveis para o confronto ${confronto} no Handebol, válido pela competição ${competicao || 'não especificada'}.

Considere os principais grupos de mercado:

🏆 **Resultado / Moneyline**
- Vencedor da partida (1X2);
- Empate Anula Aposta;
- Dupla Chance (1X, X2, 12);
- Resultado do 1º Tempo;
- Resultado combinado (HT/FT).

➖ **Handicap / Spread**
- Handicap Asiático (-1.5, +1.5, -3.5);
- Handicap Europeu;
- Handicap por tempo;
- Vence por 3+ gols (Sim/Não).

🎯 **Totais (Over/Under)**
- Total de Gols da Partida (O/U 55.5, 60.5, etc.);
- Total de Gols por Equipe (Team Totals);
- Total de Gols por Tempo;
- Ambas as equipes marcam 25+ (Sim/Não);
- Total de Gols Ímpar/Par.

💥 **Especiais e Props**
- Primeiro a marcar (Sim/Não);
- Último a marcar;
- Total de exclusões (2 min) por equipe;
- Jogo vai à prorrogação (Sim/Não);
- Time marca em ambos os tempos (Sim/Não);
- Vence de virada (Sim/Não).

📊 **Estatísticas e Desempenho**
- Gols do artilheiro principal (O/U);
- Defesas do goleiro principal (O/U);
- Eficiência em contra-ataques (% de conversão);
- Média de finalizações e erros técnicos;
- Percentual de acertos nos 9 metros e 6 metros.

🧠 **Aspectos Táticos e Contextuais**
- Ritmo ofensivo (ataques por minuto);
- Uso de goleiro-linha (frequência e eficiência);
- Desempenho em superioridade/inferioridade numérica;
- Sequência recente (vitórias, derrotas, empates);
- Adaptação ao estilo do adversário (defesa 6x0, 5x1, 3x2x1);
- Importância do jogo (fase decisiva, playoffs, amistoso);
- Desfalques e fadiga por calendário intenso.

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

// 🔹 Exemplo de integração via API ChatGPT / OpenAI
export async function analisarHandebolAPI(confronto, mercado, competicao, odd, apiKey) {
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
        { role: "system", content: "Você é um analista esportivo especialista em Handebol e apostas esportivas." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 800,
    }),
  });

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "❌ Erro: resposta vazia da API.";
}
