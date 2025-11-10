// prompts/beisebol.js
export function gerarPrompt(confronto, mercado, competicao, odd) {
  if (mercado) {
    // === Prompt ESPECÍFICO (mercado + odd opcional) ===
    return `ChatGPT, analise o mercado de ${mercado} para o confronto ${confronto} no Beisebol, válido pela competição ${competicao || 'não especificada'}.
${odd ? `A odd oferecida é ${odd}. Avalie se essa odd representa bom valor ou está abaixo do ideal considerando o contexto do jogo e o desempenho recente das equipes.` : ''}

Considere:
⚾ Arremessadores titulares e suas estatísticas principais (ERA, WHIP, Strikeouts e Walks);
💥 Potência ofensiva das equipes (Home Runs, RBIs, Slugging e OPS);
📈 Desempenho recente (vitórias, sequências, médias de corridas marcadas e sofridas);
🌤️ Condições climáticas e características do estádio (vento, altitude, tamanho dos campos);
🔁 Qualidade do bullpen (arremessadores reservas) e estabilidade nas entradas finais;
📊 Desempenho contra arremessadores destros ou canhotos (Left/Right Split Advantage);
🧠 Estratégias de jogo e momento físico das equipes (fadiga, calendário, motivação).

Indique:
1. A probabilidade real estimada para o evento ocorrer;
2. A odd mínima justa para representar valor esperado positivo;
3. Uma recomendação principal de aposta com justificativa estatística e tática;
4. Um cenário alternativo com bom valor esperado, se houver.`;
  } else {
    // === Prompt GERAL (todos os mercados) ===
    return `ChatGPT, analise todos os mercados de aposta disponíveis para o confronto ${confronto} no Beisebol, válido pela competição ${competicao || 'não especificada'}.

Considere os principais grupos de mercado:

🏆 **Resultado / Moneyline**
- Vencedor da partida (Moneyline);
- Vencedor com entradas extras incluídas;
- Vencedor em 9 entradas (sem extras);
- Melhor desempenho ofensivo por equipe (Total Hits, RBIs).

➖ **Handicap / Run Line**
- Run Line padrão (-1.5 / +1.5);
- Linhas alternativas (-2.5, -3.5);
- Resultado após 5 entradas (First 5 Innings Line);
- Handicap do 1º tempo (5 innings).

🎯 **Totais (Over/Under)**
- Total de Corridas (Over/Under);
- Total de Corridas por Equipe (Team Totals);
- Total de Corridas no 1º Inning (Yes/No Run First Inning – YRFI/NRFI);
- Total de Corridas por Inning específico.

🕒 **Parciais e Metade do Jogo**
- Vencedor após 5 entradas;
- Empate após 5 entradas;
- Total de corridas nos 5 innings.

💥 **Especiais e Props**
- Primeiro time a marcar;
- Último time a marcar;
- Ambas as equipes marcam (Sim/Não);
- Time marca em todas as entradas (Sim/Não);
- Vencedor em entradas extras;
- Total de Home Runs na partida.

👤 **Estatísticas Individuais (Player Props)**
- Total de Strikeouts do arremessador;
- Total de Hits / RBIs / Home Runs por jogador;
- Jogador marca Home Run (Sim/Não);
- Total de bases por jogador (Total Bases Over/Under);
- Pitcher concede corridas (Earned Runs Over/Under);
- Jogador rouba base (Stolen Base Prop).

🔧 **Combinações e Avançados**
- Vencedor + Total de Corridas (Combo);
- Total de Home Runs combinados;
- Resultado Exato (Correct Score);
- Jogador faz múltiplos hits (2+ hits, 3+ hits);
- Corrida ou hit em cada entrada (Sim/Não).

📊 **Aspectos Técnicos e Estratégicos**
- ERA e WHIP dos arremessadores titulares;
- Qualidade do bullpen (relievers);
- Potência ofensiva (média de corridas por jogo, HR, SLG);
- Clima e estádio (vento, altitude, dimensão do campo);
- Matchups destro vs canhoto;
- Sequência de vitórias/derrotas recentes;
- Fadiga e rotação de elenco.

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
