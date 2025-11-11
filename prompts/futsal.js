export function gerarPrompt(confronto, mercado, competicao, odd) {
  if (mercado) {
    return `Analise o mercado ${mercado} para o confronto ${confronto} no Futsal (${competicao || 'não especificada'}).
${odd ? `A odd oferecida é ${odd}. Avalie se tem valor justo.` : ''}

Considere ritmo de jogo, gols por partida, e estilo tático das equipes.
Indique a aposta mais provável, odd justa e recomendação.`;
  } else {
    return `Analise os principais mercados do confronto ${confronto} no Futsal (${competicao || 'não especificada'}):
- Resultado Final;
- Total de Gols (Over/Under);
- Handicap e Dupla Chance;
- Ambas Marcam.

Dê uma aposta principal e uma alternativa com valor esperado positivo.`;
  }
}
