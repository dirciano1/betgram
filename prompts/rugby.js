export function gerarPrompt(confronto, mercado, competicao, odd) {
  if (mercado) {
    return `Analise o mercado ${mercado} para ${confronto} no Rugby (${competicao || 'não especificada'}).
${odd ? `A odd é ${odd}. Avalie se há valor.` : ''}

Considere:
- Tentativas médias por partida;
- Fase atual das equipes;
- Confrontos diretos e mando de campo.`;
  } else {
    return `Analise todos os mercados para ${confronto} no Rugby (${competicao || 'não especificada'}):
- Resultado final;
- Handicap de pontos;
- Total de tentativas (tries);
- Primeira equipe a pontuar.

Forneça uma aposta segura e uma alternativa com maior retorno.`;
  }
}
