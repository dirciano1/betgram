export function gerarPrompt(confronto, mercado, competicao, odd) {
  return `Analise o confronto ${confronto} no Golfe (${competicao || 'não especificada'}).
${odd ? `Odd oferecida: ${odd}` : ''}

Avalie:
- Forma recente dos golfistas;
- Desempenho no tipo de campo (par, vento, green);
- Chances de top-10, top-5 e vencedor.

Indique apostas seguras e arriscadas com valor.`;
}
