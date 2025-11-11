export function gerarPrompt(confronto, mercado, competicao, odd) {
  if (mercado) {
    return `ChatGPT, analise o mercado de ${mercado} para o confronto ${confronto} em eSports (${competicao || 'competição não especificada'}).
${odd ? `A odd oferecida é ${odd}. Avalie se há valor esperado positivo baseado no desempenho recente das equipes.` : ''}

Considere:
- Estatísticas de rounds/mapas (ex: CS2, Valorant, LoL);
- Win rate e desempenho recente;
- Map pool e picks/bans;
- Situação do torneio.

Indique:
1. O cenário mais provável dentro desse mercado;
2. A odd justa estimada;
3. Uma aposta recomendada e justificativa breve.`;
  } else {
    return `Analise os mercados disponíveis para o confronto ${confronto} em eSports (${competicao || 'competição não especificada'}).

Considere mercados como:
- Resultado (vencedor do mapa/série);
- Total de mapas/rounds (over/under);
- Primeira eliminação ou primeiro mapa;
- Handicap de mapas;
- Estatísticas individuais (KDA, kills, first blood).

Indique:
1. Mercado de maior probabilidade;
2. Odd mínima justa;
3. Melhor aposta e cenário alternativo de valor.`;
  }
}
