// prompts/mma.js
export function gerarPrompt(confronto, mercado, competicao, odd) {
  if (mercado) {
    // Prompt específico (mercado + odd opcional)
    return `ChatGPT, analise o mercado de ${mercado} para o confronto ${confronto} no MMA, válido pela competição ${competicao || 'não especificada'}.
${odd ? `A odd oferecida é ${odd}. Avalie se essa odd representa bom valor ou está abaixo do ideal considerando o estilo dos lutadores e o contexto do combate.` : ''}

Considere:
🥊 Estilo técnico de cada lutador (striker, grappler, wrestler, all-rounder);
🧠 Histórico de vitórias por nocaute, finalização e decisão;
💪 Resistência física (cardio) e desempenho em lutas longas;
📈 Aproveitamento de quedas, controle no chão e defesa de golpes;
⚡ Ritmo e intensidade média das lutas (começo agressivo ou cadenciado);
🩸 Duração média das lutas anteriores e frequência de interrupções;
📏 Diferença de alcance, altura e peso real no dia da luta;
🏟️ Contexto do evento (tipo de octógono, altitude, intervalo entre lutas, motivação).

Indique:
1. A probabilidade real estimada de o evento ocorrer;
2. A odd mínima justa para representar valor esperado positivo;
3. Uma recomendação de aposta e justificativa técnica (estilo, estatísticas e contexto);
4. Um cenário alternativo com bom valor esperado, se houver.`;
  } else {
    // Prompt geral (todos os mercados)
    return `ChatGPT, analise todos os mercados de aposta disponíveis para o confronto ${confronto} no MMA, válido pela competição ${competicao || 'não especificada'}.

Considere os principais grupos de mercado:

🏆 **Resultado da Luta**
- Vencedor da luta (Moneyline);
- Vencedor com empate técnico incluso (Draw No Bet);
- Empate (Draw).

⚔️ **Método de Vitória**
- Por Nocaute/Técnico (KO/TKO);
- Por Finalização (Submission);
- Por Decisão dos Juízes (Decision);
- Por Desqualificação (DQ) ou Interrupção Médica (Doctor Stoppage).

⏱️ **Total de Rounds (Over/Under)**
- Mais/Menos de 1.5 / 2.5 / 3.5 / 4.5 rounds;
- Luta vai até a decisão (Sim/Não);
- Luta termina antes do limite (Sim/Não).

🥋 **Round da Vitória**
- Lutador vence no Round 1 / 2 / 3 / 4 / 5;
- Vence por KO ou Finalização em round específico;
- Luta termina entre rounds (ex: Round 1–2).

📊 **Props Avançados**
- Total de knockdowns (0.5 / 1.5 / 2.5);
- Total de golpes significativos por lutador;
- Total de quedas (takedowns);
- Vencedor + Método de Vitória (combo);
- Vencedor + Round de Vitória (combo).

💡 **Contexto Estratégico**
- Estilo de luta predominante e matchup (striker vs grappler);
- Resistência e cardio em lutas longas;
- Histórico de absorção de golpes e defesa de quedas;
- Tempo desde a última luta e ritmo de atividade;
- Impacto do cage pequeno (mais finalizações e KOs);
- Nível técnico dos adversários enfrentados recentemente;
- Fatores externos: altitude, corte de peso, motivação e evento principal ou preliminar.

Para cada grupo, indique:
1. O mercado com maior probabilidade de sucesso;
2. A odd mínima justa para representar valor positivo;
3. A aposta principal com justificativa técnica e contextual;
4. Um mercado alternativo com valor, se existir.

Finalize com um resumo destacando:
- 🟩 A aposta mais segura (alta probabilidade de acerto);
- 🟥 A aposta mais arriscada (alto potencial de retorno).`;
  }
}
