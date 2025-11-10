// prompts/basquete.js
export function gerarPrompt(confronto, mercado, competicao, odd) {
  if (mercado) {
    // Prompt específico com mercado e odd
    return `ChatGPT, analise o mercado de ${mercado} para o confronto ${confronto} no Basquete, válido pela competição ${competicao || 'não especificada'}.
${odd ? `A odd oferecida é ${odd}. Avalie se essa odd representa bom valor ou está abaixo do esperado.` : ''}

Considere:
- Estilo de jogo das equipes (ritmo, pace, transição, defesa);
- Desempenho ofensivo/defensivo recente e médias de pontos;
- Efeito do mando de quadra e possíveis desfalques;
- Tendência do confronto direto (histórico H2H);
- E impacto de eventuais prorrogações no mercado analisado.

Indique:
1. A probabilidade real estimada para o evento ocorrer;
2. A odd mínima justa para representar valor positivo;
3. Uma recomendação de aposta e justificativa clara;
4. Se possível, um cenário alternativo com valor esperado.`;
  } else {
    // Prompt geral (todos mercados)
    return `ChatGPT, analise todos os mercados de aposta disponíveis para o confronto ${confronto} no Basquete, válido pela competição ${competicao || 'não especificada'}.

Considere os principais grupos de mercado:

🏆 **Resultado Final e Handicap**
- Vencedor da partida (Moneyline);
- Handicap principal (Spread ±);
- Handicap por tempo ou quarto.

🎯 **Totais de Pontos**
- Total da partida (Over/Under);
- Total de pontos por equipe;
- Pontos por tempo/quarto.

👥 **Estatísticas Individuais**
- Pontos, Rebotes, Assistências ou Combinações (P+R+A);
- Jogador para marcar mais pontos;
- Probabilidade de triplo-duplo.

🕒 **Parciais e Especiais**
- Quem vence o 1º tempo / 1º quarto;
- Resultado combinado (HT/FT);
- Se o jogo irá para prorrogação;
- Margem de vitória provável.

📊 **Outros Aspectos**
- Ritmo e pace médio das equipes;
- Eficiência ofensiva/defensiva (ORtg / DRtg);
- Impacto de back-to-back games e rotação.

Para cada grupo, indique:
1. O mercado mais provável de sucesso;
2. A odd mínima justa para valor positivo;
3. Aposta principal com justificativa (estilo, estatísticas e contexto);
4. Uma aposta alternativa de valor, se existir.

Finalize com um resumo destacando:
- 🟩 A aposta mais segura (alta probabilidade);
- 🟥 A aposta mais arriscada (alto retorno potencial).`;
  }
}
