export function gerarPrompt(confronto, mercado, competicao, odd) {
  if (mercado) {
    return `Analise o mercado ${mercado} para o confronto ${confronto} no Handebol (${competicao || 'competição não especificada'}).
${odd ? `A odd oferecida é ${odd}. Avalie se representa valor.` : ''}

Considere:
- Média de gols por jogo;
- Força ofensiva e defensiva;
- Fator casa/fora;
- Desempenho recente e confrontos diretos.

Indique a aposta mais provável e a odd mínima justa.`;
  } else {
    return `Analise todos os mercados do confronto ${confronto} no Handebol (${competicao || 'competição não especificada'}).

Inclua:
- Resultado final;
- Total de gols (over/under);
- Handicap;
- Resultado no intervalo.

Dê uma aposta principal, uma alternativa e um resumo com valor esperado.`;
  }
}
