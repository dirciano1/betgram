// prompts/esports.js
// 🔹 Módulo para gerar prompt de análise de E-sports (CS2, Valorant, LoL, Dota 2, R6, Overwatch)
// ✅ Compatível com API ChatGPT / OpenAI e estrutura do BetGram

export function gerarPrompt(confronto, mercado, competicao, odd) {
  if (mercado) {
    // === Prompt ESPECÍFICO (mercado + odd opcional) ===
    return `ChatGPT, analise o mercado de ${mercado} para o confronto ${confronto} no cenário de E-sports, válido pela competição ${competicao || 'não especificada'}.
${odd ? `A odd oferecida é ${odd}. Avalie se essa odd representa bom valor considerando forma recente, mapa, estratégia e desempenho das equipes.` : ''}

Considere:
🎮 Jogo e formato (CS2, Valorant, LoL, Dota 2, BO1, BO3, BO5);
📊 Estatísticas recentes (taxa de vitória, kills, rounds, mapas);
🧠 Estratégias e estilos de jogo (agressivo, defensivo, tático);
🗺️ Map Pool e histórico nos mapas mais jogados;
💣 Eficiência em pistol rounds e conversão de vantagem inicial;
🔥 Momentum psicológico e impacto de vitórias/derrotas recentes;
👥 Desempenho individual dos jogadores (rating, ADR, KDA, ACS, GPM);
🏆 Importância da partida (fase de grupos, playoffs, final);
💬 Comunicação e entrosamento da equipe;
🌎 Meta atual do jogo e adaptação às mudanças de patch.

Indique:
1. A probabilidade real estimada de o evento ocorrer;
2. A odd mínima justa para representar valor esperado positivo;
3. Uma recomendação de aposta e justificativa técnica;
4. Um mercado alternativo com bom valor esperado, se houver.`;
  } else {
    // === Prompt GERAL (todos os mercados) ===
    return `ChatGPT, analise todos os mercados de aposta disponíveis para o confronto ${confronto} no cenário de E-sports, válido pela competição ${competicao || 'não especificada'}.

Considere os principais grupos de mercado:

🏆 **Resultado / Moneyline**
- Vencedor da Série (BO1, BO3, BO5);
- Vencedor do Mapa 1 / 2 / 3;
- Vencedor com prorrogação (OT) incluída;
- Vencedor do Pistol Round.

➖ **Handicap / Spread**
- Handicap de Mapas (-1.5 / +1.5);
- Handicap de Rounds (ex: -3.5);
- Handicap de Kill Difference;
- Vitória com ou sem perder mapa.

🎯 **Totais (Over/Under)**
- Total de Mapas Jogados (O/U);
- Total de Rounds (O/U);
- Total de Kills (O/U);
- Total de Headshots (CS2 / Valorant);
- Total de Abates do jogador principal;
- Total de Torres / Objetivos (LoL / Dota 2);
- Tempo total de jogo (O/U minutos).

💥 **Especiais e Props**
- Equipe faz Ace / Clutch (Sim/Não);
- Primeira Torre / Primeiro Dragão / Primeiro Barão (LoL / Dota);
- Primeira Blood Kill (Sim/Não);
- Jogador com maior número de kills;
- MVP da série;
- Time vence de virada (Sim/Não);
- Jogo vai para Overtime (Sim/Não).

📊 **Estatísticas Individuais**
- Rating 2.0 médio (CS2);
- ADR (Average Damage per Round);
- Headshot % (CS2 / Valorant);
- ACS / KDA médio (Valorant / LoL);
- GPM e XPM (Dota 2);
- Eficácia de suporte e controle de visão.

🧠 **Aspectos Estratégicos e Contextuais**
- Desempenho por lado (CT/T ou Attack/Defense);
- Aproveitamento em Pistol e Anti-Eco Rounds;
- Mapa mais favorável para cada equipe;
- Condição psicológica e sequência recente;
- Substituições e lineup atualizado;
- Meta atual e adaptação a novos patches;
- Tática de ban/pick (draft estratégico);
- Histórico de confrontos diretos (H2H).

Para cada grupo, indique:
1. O mercado mais provável de sucesso;
2. A odd mínima justa para representar valor positivo;
3. A aposta principal com justificativa técnica e contextual;
4. Um mercado alternativo com bom valor esperado.

Finalize com um resumo destacando:
- 🟩 A aposta mais segura (alta probabilidade);
- 🟥 A aposta mais arriscada (alto potencial de retorno).`;
  }
}

// 🔹 Exemplo de integração com API ChatGPT / OpenAI
export async function analisarEsportsAPI(confronto, mercado, competicao, odd, apiKey) {
  const prompt = gerarPrompt(confronto, mercado, competicao, odd);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é um analista especialista em E-sports e apostas eletrônicas, com foco em jogos como CS2, Valorant, LoL, Dota 2, e R6." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 800,
    }),
  });

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "❌ Erro: resposta vazia da API.";
}
