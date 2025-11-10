// prompts/volei.js
export function gerarPrompt(confronto, mercado, competicao, odd) {
  if (mercado) {
    // Prompt ESPECÍFICO (mercado + odd opcional)
    return `ChatGPT, analise o mercado de ${mercado} para o confronto ${confronto} no Vôlei, válido pela competição ${competicao || 'não especificada'}.
${odd ? `A odd oferecida é ${odd}. Avalie se essa odd representa bom valor ou está abaixo do ideal considerando o contexto e desempenho das equipes.` : ''}

Considere:
🏐 Média de pontos por set e ritmo ofensivo das equipes;
💪 Eficiência em side-out (recepção e contra-ataque);
🚫 Taxa de erros não forçados e aproveitamento no bloqueio;
🔥 Histórico direto entre as equipes e tendência de sets longos;
📈 Fase atual, fadiga e calendário recente (liga, mundial, torneio de praia);
🎯 Tipo de competição (vôlei de quadra ou de praia) e impacto no formato de sets (melhor de 3 ou 5);
⚡ Força no saque, variação de jogadas e presença de estrelas ofensivas.

Indique:
1. A probabilidade real estimada de o evento ocorrer;
2. A odd mínima justa para representar valor esperado positivo;
3. Uma recomendação de aposta com justificativa tática e estatística;
4. Um cenário alternativo com bom valor esperado, se houver.`;
  } else {
    // Prompt GERAL (todos os mercados)
    return `ChatGPT, analise todos os mercados de aposta disponíveis para o confronto ${confronto} no Vôlei, válido pela competição ${competicao || 'não especificada'}.

Considere os principais grupos de mercado:

🏆 **Resultado / Moneyline**
- Vencedor da partida (Match Winner);
- Vencedor do 1º / 2º / 3º set;
- Placar correto em sets (3x0, 3x1, 3x2 ou 2x0, 2x1 no vôlei de praia).

➖ **Handicap**
- Handicap de Sets (ex: -1.5 ou +1.5);
- Handicap de Pontos (ex: -4.5 ou +5.5);
- Handicap em sets específicos (1º ou 2º set).

🎯 **Totais (Over/Under)**
- Total de Pontos na partida;
- Total de Pontos por Set;
- Total de Sets (Over/Under 3.5);
- Total de Pontos por Equipe.

🔥 **Mercados Especiais**
- Jogo terá Tie-break (Sim/Não);
- Ambas as equipes vencem ao menos 1 set;
- Jogo vai para 5 sets (ou 3 sets no vôlei de praia);
- Primeira equipe a marcar 10 / 15 / 20 pontos;
- Vitória com vantagem de 2+ pontos.

📊 **Parciais e Desempenho**
- Resultado após o 1º e 2º set;
- Equipe com mais aces, bloqueios ou erros;
- Jogador com maior pontuação;
- Total de aces combinados na partida.

📈 **Aspectos Técnicos**
- Ritmo médio de sets e rallies;
- Eficiência ofensiva e defensiva (ataque, bloqueio, side-out);
- Força do saque e variação de recepção;
- Condições físicas e climáticas (vento, calor no vôlei de praia);
- Desempenho em partidas recentes e histórico entre as equipes.

Para cada grupo, indique:
1. O mercado com maior probabilidade de sucesso;
2. A odd mínima justa para representar valor positivo;
3. A aposta principal com justificativa estatística e contextual;
4. Um mercado alternativo de valor, se existir.

Finalize com um resumo destacando:
- 🟩 A aposta mais segura (alta probabilidade);
- 🟥 A aposta mais arriscada (alto potencial de retorno).`;
  }
}
