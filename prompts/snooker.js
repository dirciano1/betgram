export function gerarPrompt(confronto, mercado, competicao, odd) {
  return `Analise ${confronto} no Snooker (${competicao || 'não especificada'}).
${odd ? `Odd ${odd}` : ''}

Considere:
- Forma dos jogadores e média de tacadas altas (century breaks);
- Total de frames (Over/Under);
- Primeiro a vencer X frames.

Dê aposta principal e alternativa com justificativa.`;
}
