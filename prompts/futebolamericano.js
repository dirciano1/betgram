// prompts/futebolamericano.js
export function gerarPrompt(confronto, mercado, competicao, odd) {
  if (mercado) {
    // === Prompt ESPECÍFICO (mercado + odd opcional) ===
    return `ChatGPT, analise o mercado de ${mercado} para o confronto ${confronto} no Futebol Americano, válido pela competição ${competicao || 'não especificada'}.
${odd ? `A odd oferecida é ${odd}. Avalie se essa odd representa bom valor ou está abaixo do ideal considerando o desempenho recente das equipes, clima e matchups.` : ''}

Considere:
🏈 Eficiência ofensiva (pontos por drive, red zone e 3rd downs convertidos);
💪 Força da defesa (pressão sobre o QB, turnovers forçados e defesa terrestre/aérea);
📈 Ritmo de jogo (ataque rápido, posse longa ou equilíbrio entre passe e corrida);
🌦️ Clima e vento (impactam field goals e passes longos);
👥 Matchups individuais (QB x defesa, WRs x CBs, OL x DL);
📊 Histórico recente de pontuação e desempenho por quarto;
⚙️ Média de jardas, touchdowns e turnovers por jogo;
🧠 Estratégia dos treinadores e momento psicológico das equipes.

Indique:
1. A probabilidade real estimada de o evento ocorrer;
2. A odd mínima justa para representar valor esperado positivo;
3. Uma recomendação de aposta com justificativa tática e estatística;
4. Um cenário alternativo com bom valor esperado, se existir.`;
  } else {
    // === Prompt GERAL (todos os mercados) ===
    return `ChatGPT, analise todos os mercados de aposta disponíveis para o confronto ${confronto} no Futebol Americano, válido pela competição ${competicao || 'não especificada'}.

Considere os principais grupos de mercado:

🏆 **Resultado / Moneyline**
- Vencedor da partida (Moneyline);
- Vencedor por tempo (1º tempo, 2º tempo, 4º quarto);
- Primeiro time a pontuar / Último time a pontuar;
- Time que marcará primeiro touchdown.

➖ **Handicap / Spread**
- Spread padrão (ex: -6.5 / +6.5);
- Linhas alternativas com odds ajustadas;
- Spread por tempo ou quarto.

🎯 **Totais (Over/Under)**
- Total de pontos da partida (O/U);
- Total de pontos por equipe;
- Total de touchdowns (O/U);
- Total de pontos por tempo ou quarto.

💥 **Touchdowns e Pontos Especiais**
- Jogador marca touchdown (Anytime TD Scorer);
- Primeiro jogador a marcar touchdown (First TD);
- Dois ou mais touchdowns (2+ TDs);
- Total de field goals (O/U);
- Conversões de 2 pontos (Sim/Não);
- Safety durante o jogo (Sim/Não).

👤 **Props de Jogadores**
🏈 *Quarterbacks*
- Jardas passadas (O/U);
- Touchdowns passados;
- Interceptações (O/U 0.5).

🏃 *Running Backs*
- Jardas corridas (O/U);
- Touchdowns corridos;
- Tentativas de corrida.

🎯 *Receivers/Tight Ends*
- Jardas recebidas (O/U);
- Número de recepções;
- Touchdowns recebidos.

📊 **Estatísticas de Equipe e Jogo**
- Total de turnovers (O/U);
- Total de sacks (O/U);
- Margem de vitória (ex: 1–6 pts, 7–12 pts);
- Primeiro a 10 / 20 / 30 pontos;
- Ambas as equipes pontuam em todos os quartos (Sim/Não).

⚙️ **Combinações e Especiais**
- Vencedor + Total de Pontos (Combo);
- Jogador marca TD + Time vence;
- Intervalo/Final (HT/FT);
- Vitória por número exato de pontos;
- Corrida de pontos (Team Race to Points).

🧠 **Contexto Estratégico e Situacional**
- Clima e condições do estádio (vento, chuva, temperatura);
- Eficiência ofensiva e defensiva recente;
- Desempenho fora/de casa;
- Matchups diretos (QB vs defesa, RB vs linha defensiva);
- Tempo médio de posse de bola;
- Fadiga defensiva e viagens longas;
- Histórico dos confrontos e momento da temporada.

Para cada grupo, indique:
1. O mercado mais provável de sucesso;
2. A odd mínima justa para representar valor positivo;
3. A aposta principal com justificativa técnica e contextual;
4. Um mercado alternativo com valor, se existir.

Finalize com um resumo destacando:
- 🟩 A aposta mais segura (alta probabilidade);
- 🟥 A aposta mais arriscada (alto potencial de retorno).`;
  }
}
