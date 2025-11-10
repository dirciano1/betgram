// prompts/hoquei.js
export function gerarPrompt(confronto, mercado, competicao, odd) {
  if (mercado) {
    // === Prompt ESPECÍFICO (mercado + odd opcional) ===
    return `ChatGPT, analise o mercado de ${mercado} para o confronto ${confronto} no Hóquei no Gelo, válido pela competição ${competicao || 'não especificada'}.
${odd ? `A odd oferecida é ${odd}. Avalie se essa odd representa bom valor ou está abaixo do ideal considerando o desempenho recente, goleiros e contexto da partida.` : ''}

Considere:
🏒 Média de gols marcados e sofridos por jogo pelas duas equipes;
🧤 Desempenho dos goleiros titulares (save%, GAA, shutouts);
⚡ Eficiência no Power Play e no Penalty Kill;
📈 Histórico recente (vitórias, derrotas e média de gols por período);
🔥 Ritmo ofensivo e número médio de chutes a gol (shots on goal);
❄️ Fadiga e sequência de jogos (back-to-back games);
🏠 Vantagem de jogar em casa e desempenho fora de casa;
🧮 Lesões e ausência de jogadores de linha principal (forwards e defensores);
🌎 Tipo de gelo, arena e condições (altitude, ambiente fechado ou aberto).

Indique:
1. A probabilidade real estimada de o evento ocorrer;
2. A odd mínima justa para representar valor esperado positivo;
3. Uma recomendação de aposta e justificativa tática e estatística;
4. Um mercado alternativo com bom valor esperado, se houver.`;
  } else {
    // === Prompt GERAL (todos os mercados) ===
    return `ChatGPT, analise todos os mercados de aposta disponíveis para o confronto ${confronto} no Hóquei no Gelo, válido pela competição ${competicao || 'não especificada'}.

Considere os principais grupos de mercado:

🏆 **Resultado / Moneyline**
- Vencedor da partida (inclui prorrogação e pênaltis);
- Vencedor no tempo regulamentar (3-way);
- Empate (em 60 minutos);
- Empate Anula Aposta (Draw No Bet).

➖ **Handicap / Puck Line**
- Puck Line padrão (-1.5 / +1.5);
- Linhas alternativas (-2.5 / +2.5);
- Handicap por período (1º, 2º ou 3º).

🎯 **Totais (Over/Under)**
- Total de Gols da Partida (O/U);
- Total de Gols por Equipe (Team Totals);
- Total de Gols por Período (O/U 1.5);
- Ambas as equipes marcam (Sim/Não).

🕒 **Parciais e Períodos**
- Vencedor do 1º / 2º / 3º período;
- Total de gols em cada período;
- Qual período terá mais gols;
- Resultado combinado (HT/FT).

💥 **Especiais e Situações de Jogo**
- Primeiro a marcar;
- Último a marcar;
- Equipe marca primeiro e vence;
- Vence de virada (Win from Behind);
- Jogo vai para prorrogação (Sim/Não);
- Jogo vai para pênaltis (Sim/Não).

👤 **Estatísticas Individuais (Player Props)**
- Jogador marca gol (Anytime Goal Scorer);
- Primeiro jogador a marcar (First Goal Scorer);
- Jogador marca 2+ ou 3+ gols (Hat-trick);
- Total de assistências (O/U);
- Total de pontos (gols + assistências);
- Total de chutes a gol (Shots on Goal).

📊 **Estatísticas de Equipe**
- Power Plays convertidos (O/U);
- Total de Saves do goleiro (O/U);
- Penalidades cometidas (O/U);
- Margem de vitória (1–2, 3–4, etc.);
- Ambas as equipes marcam em todos os períodos (Sim/Não).

⚙️ **Combinações e Avançados**
- Vencedor + Total de Gols (Combo);
- Time vence e ambas marcam;
- Placar exato;
- Equipe vence ambos os períodos;
- Jogador marca e time vence.

🧠 **Aspectos Estratégicos**
- Eficiência ofensiva (média de gols por jogo e conversão de chutes);
- Desempenho defensivo e de goleiros;
- Fadiga (back-to-back games);
- Condição física e lesões;
- Histórico entre as equipes;
- Situação na tabela e motivação (playoffs, mando, rivalidade).

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
