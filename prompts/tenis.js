// prompts/tenis.js
export function gerarPrompt(confronto, mercado, competicao, odd) {
  if (mercado) {
    // Prompt específico com mercado e odd fornecida
    return `ChatGPT, analise o mercado de ${mercado} para o confronto ${confronto} no Tênis, válido pela competição ${competicao || 'não especificada'}.
${odd ? `A odd oferecida é ${odd}. Avalie se essa odd representa bom valor ou está abaixo do ideal considerando o contexto da partida.` : ''}

Considere:
🎾 Tipo de superfície (saibro, grama ou quadra dura) e impacto no número de games e ritmo do jogo;
💪 Estilo de jogo de cada atleta (sacador, contra-atacante, all-court, defensivo);
📈 Desempenho recente e forma física (vitórias, fadiga, torneios consecutivos);
🤝 Histórico direto entre os jogadores (H2H) e frequência de tiebreaks;
🔥 Aproveitamento de primeiro saque e break points salvos/conquistados;
🧠 Fatores psicológicos e momento decisivo (consistência em finais, pressão no 3º set).

Indique:
1. A probabilidade real estimada para o evento ocorrer;
2. A odd mínima justa para representar valor esperado positivo;
3. Uma recomendação de aposta e justificativa tática;
4. E, se possível, um cenário alternativo com bom valor esperado.`;
  } else {
    // Prompt geral: análise de todos os mercados
    return `ChatGPT, analise todos os mercados de aposta disponíveis para o confronto ${confronto} no Tênis, válido pela competição ${competicao || 'não especificada'}.

Considere os principais grupos de mercado:

🏆 **Resultado / Moneyline**
- Vencedor do jogo;
- Vencedor do 1º ou 2º set;
- Vencedor com Handicap de Sets (ex: 2x0, 2x1).

➖ **Handicap (Games e Sets)**
- Handicap de Games (ex: +3.5 / -4.5);
- Handicap de Sets (+1.5 ou -1.5).

🎯 **Totais (Over/Under)**
- Total de Games na partida;
- Total de Sets (Over/Under 2.5);
- Total de Games por jogador.

🔥 **Mercados Especiais**
- Ambos vencem um set (Sim/Não);
- Jogo vai para 3 sets (Sim/Não);
- Haverá tiebreak;
- Placar correto (2x0, 2x1);
- Vencedor e Total combinados.

🕒 **Parciais e Props**
- Primeiro a quebrar o saque;
- Jogador com mais aces ou duplas faltas;
- Vencer após perder o 1º set;
- Resultado após o 1º set.

📊 **Aspectos Táticos**
- Tipo de quadra e impacto no ritmo;
- Frequência de tiebreaks em confrontos anteriores;
- Condição física e mental dos jogadores;
- Percentual de vitórias no serviço e devolução;
- Eficiência em games decisivos (tiebreaks, match points).

Para cada grupo, indique:
1. O mercado mais provável de sucesso;
2. A odd mínima justa para representar valor positivo;
3. Uma aposta principal com justificativa (baseada em estilo, estatísticas e contexto);
4. Um mercado alternativo de valor.

Finalize com um resumo destacando:
- 🟩 A aposta mais segura (alta probabilidade);
- 🟥 A aposta mais arriscada (alto potencial de retorno).`;
  }
}
