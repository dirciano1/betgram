export function gerarPrompt(confronto, mercado, competicao, odd) {
  return `Analise o confronto ${confronto} no Ciclismo (${competicao || 'não especificada'}).
${odd ? `Odd oferecida: ${odd}` : ''}

Considere:
- Tipo de prova (montanha, sprint, contrarrelógio);
- Histórico dos atletas em percursos similares;
- Condições climáticas e de equipe.

Indique favoritos, valor esperado e possíveis surpresas.`;
}
