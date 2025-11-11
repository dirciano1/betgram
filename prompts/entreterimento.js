export function gerarPrompt(confronto, mercado, competicao, odd) {
  return `Analise o evento ${confronto} em Entretenimento (${competicao || 'não especificado'}).
${odd ? `Odd: ${odd}` : ''}

Considere:
- Popularidade dos indicados;
- Tendências históricas e críticas especializadas;
- Probabilidade real vs. odd oferecida.

Indique a aposta mais provável e uma alternativa de valor.`;
}
