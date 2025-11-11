export function gerarPrompt(confronto, mercado, competicao, odd) {
  return `Analise o confronto ${confronto} em Dardos (${competicao || 'não especificada'}).
${odd ? `Odd analisada: ${odd}` : ''}

Considere:
- Média de checkouts;
- Percentual de acertos em double;
- Histórico entre jogadores.

Indique mercados com maior probabilidade e valor esperado.`;
}
