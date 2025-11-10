// prompts/f1.js
export function gerarPrompt(confronto, mercado, competicao, odd) {
  if (mercado) {
    // === Prompt ESPECÍFICO (mercado + odd opcional) ===
    return `ChatGPT, analise o mercado de ${mercado} para o confronto ${confronto} na Fórmula 1, válido pela competição ${competicao || 'não especificada'}.
${odd ? `A odd oferecida é ${odd}. Avalie se essa odd representa bom valor ou está abaixo do ideal considerando o desempenho dos pilotos, condições da corrida e contexto do circuito.` : ''}

Considere:
🏎️ Tipo de pista (urbana, mista ou de alta velocidade);
🌦️ Condições climáticas esperadas (chuva, calor, vento, temperatura dos pneus);
⚙️ Estratégia de pneus (macio, médio, duro) e impacto de paradas;
🧮 Ritmo de corrida (race pace), velocidade em reta e curvas de alta;
📈 Desempenho recente da equipe e atualizações no carro;
🧠 Histórico dos pilotos neste circuito e consistência em longos stints;
🚦 Probabilidade de Safety Car, bandeira vermelha ou abandonos;
🏁 Diferença de desempenho entre companheiros de equipe.

Indique:
1. A probabilidade real estimada de o evento ocorrer;
2. A odd mínima justa para representar valor esperado positivo;
3. Uma recomendação de aposta e justificativa técnica (carro, ritmo e estratégia);
4. Um cenário alternativo com bom valor esperado, se existir.`;
  } else {
    // === Prompt GERAL (todos os mercados) ===
    return `ChatGPT, analise todos os mercados de aposta disponíveis para o confronto ${confronto} na Fórmula 1, válido pela competição ${competicao || 'não especificada'}.

Considere os principais grupos de mercado:

🏆 **Resultado da Corrida**
- Vencedor (Race Winner);
- Pódio (Top 3);
- Top 6 / Top 10 Finish;
- Melhor piloto da equipe (Team Head-to-Head);
- Equipe vencedora (Team to Win).

⏱️ **Qualificação / Grid de Largada**
- Pole Position (vencedor da qualificação);
- Top 3 no Qualifying;
- Head-to-Head na Classificação;
- Diferença de tempo (gap to P2).

⚔️ **Head-to-Head (Geral)**
- Quem termina à frente entre dois pilotos;
- Head-to-Head em corrida ou qualy.

🎯 **Totais (Over/Under)**
- Total de abandonos (DNF);
- Total de Safety Cars;
- Total de bandeiras vermelhas ou penalidades;
- Total de ultrapassagens (no mercado live).

💨 **Voltas Rápidas e Especiais**
- Piloto faz a volta mais rápida (Fastest Lap);
- Equipe faz a volta mais rápida;
- Vencedor + Volta Rápida (Double);
- Pole + Vitória + Volta Rápida (Grand Chelem);
- Corrida termina sob Safety Car (Sim/Não);
- Ambos os carros da equipe terminam a corrida.

📊 **Contexto Técnico e Estratégico**
- Tipo de circuito e probabilidade de ultrapassagens;
- Efeitos das atualizações aerodinâmicas recentes;
- Clima e temperatura dos pneus durante o GP;
- Estratégia ideal de paradas (1-stop vs 2-stop);
- Durabilidade e consumo de pneus;
- Penalidades de grid e confiabilidade (reliability);
- Histórico da equipe e dos pilotos neste circuito;
- Influência do DRS e do setup de downforce.

Para cada grupo, indique:
1. O mercado mais provável de sucesso;
2. A odd mínima justa para representar valor positivo;
3. Uma aposta principal com justificativa técnica e contextual;
4. Um mercado alternativo de valor, se existir.

Finalize com um resumo destacando:
- 🟩 A aposta mais segura (alta probabilidade);
- 🟥 A aposta mais arriscada (alto potencial de retorno).`;
  }
}
