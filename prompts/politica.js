export function gerarPrompt(confronto, mercado, competicao, odd) {
  return `Analise o cenário político ${confronto} (${competicao || 'não especificado'}).
${odd ? `A odd é ${odd}.` : ''}

Considere:
- Pesquisas eleitorais;
- Tendências de aprovação;
- Cenários alternativos e impacto econômico.

Forneça aposta provável e possível valor oculto.`;
}
