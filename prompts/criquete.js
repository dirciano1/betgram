export function gerarPrompt(confronto, mercado, competicao, odd) {
  return `Analise ${confronto} no Críquete (${competicao || 'não especificada'}).
${odd ? `Odd analisada: ${odd}` : ''}

Inclua:
- Forma dos batedores e arremessadores;
- Tipo de campo (pitch) e impacto no jogo;
- Mercados de total runs, wickets e vencedor.

Forneça recomendação de aposta e cenário alternativo.`;
}
