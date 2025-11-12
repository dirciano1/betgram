// prompts/criquete.js
// 🔹 Módulo para gerar prompt de análise de Críquete (T20, ODI, Test Matches)
// ✅ Estruturado para integração direta com API OpenAI / Gemini / Claude

export function gerarPrompt(confronto, mercado, competicao, odd) {
  if (mercado) {
    // === Prompt ESPECÍFICO (mercado + odd opcional) ===
    return `ChatGPT, analise o mercado de ${mercado} para o confronto ${confronto} no Críquete, válido pela competição ${competicao || 'não especificada'}.
${odd ? `A odd oferecida é ${odd}. Avalie se essa odd representa bom valor ou está abaixo do ideal considerando o formato do jogo, condição do campo e desempenho das equipes.` : ''}

Considere:
🏏 Formato da partida (T20, ODI, Test);
🌦️ Condições climáticas e influência do clima (chuva, umidade, vento);
🏟️ Condição do campo (pitch) — favorável a batedores ou arremessadores;
🔥 Desempenho recente das equipes e jogadores-chave;
🎯 Estatísticas de runs e wickets médios por partida;
📊 Eficiência dos bowlers e taxa de strike (SR, economy rate);
💪 Força do batting order (top order, middle order e tailenders);
🧠 Estratégia de cada time (bat primeiro ou segundo, tipo de powerplay);
🕒 Desempenho por innings (1st innings vs 2nd innings);
👥 Head-to-head e histórico entre as equipes.

Indique:
1. A probabilidade real estimada de o evento ocorrer;
2. A odd mínima justa para representar valor esperado positivo;
3. Uma recomendação de aposta e justificativa estatística e tática;
4. Um mercado alternativo com bom valor esperado, se houver.`;
  } else {
    // === Prompt GERAL (todos os mercados) ===
    return `ChatGPT, analise todos os mercados de aposta disponíveis para o confronto ${confronto} no Críquete, válido pela competição ${competicao || 'não especificada'}.

Considere os principais grupos de mercado:

🏆 **Resultado / Match Winner**
- Vencedor da Partida (inclui super over, se aplicável);
- Empate (Draw) — comum em Test Matches;
- Double Chance (empate devolve);
- Vencedor após coin toss (Sim/Não).

⚖️ **Handicap e Margens**
- Vencedor com Handicap de Runs ou Wickets;
- Margem de Vitória (por runs ou wickets);
- Equipe vence por 1–10 / 11–20 / 21+ runs.

🎯 **Totais (Over/Under)**
- Total de Runs da Partida;
- Total de Runs da Equipe (Team Totals);
- Total de Runs em um Over específico;
- Total de Wickets;
- Total de Boundaries (4s + 6s);
- Total de Sixes;
- Total de Extras (no balls, wides).

🕒 **Por Innings / Over**
- Runs no 1º Over / 1ª Parceria;
- Runs no 10º, 15º, 20º Over;
- Total de Wickets no 1º Innings;
- Qual equipe lidera após 10 Overs (T20) ou 25 Overs (ODI);
- Total de Runs no Powerplay.

👤 **Props de Jogadores**
- Jogador faz 50+ runs / 100+ runs;
- Jogador marca o maior número de runs;
- Melhor arremessador (most wickets);
- Primeiro a marcar 6 (First Six Hitter);
- Total de wickets de um jogador (O/U);
- Melhor jogador da partida (Man of the Match).

💥 **Especiais**
- “Ambas as equipes passam de 150 runs” (Sim/Não);
- “Algum jogador marca century” (Sim/Não);
- “Algum jogador faz hat-trick” (Sim/Não);
- “Wicket no 1º Over” (Sim/Não);
- “Match vai para Super Over” (Sim/Não).

🌦️ **Contexto e Estratégia**
- Clima e pitch (umidade, desgaste, vento lateral);
- Vantagem de quem começa atacando (batting first vs chasing);
- Desempenho histórico no estádio;
- Fadiga e rotação de bowlers;
- Estatísticas recentes em partidas de mesmo formato;
- Head-to-head entre capitães e bowlers específicos.

Para cada grupo, indique:
1. O mercado mais provável de sucesso;
2. A odd mínima justa para representar valor positivo;
3. A aposta principal com justificativa técnica e contextual;
4. Um mercado alternativo de valor, se existir.

Finalize com um resumo destacando:
- 🟩 A aposta mais segura (alta probabilidade);
- 🟥 A aposta mais arriscada (alto potencial de retorno).`;
  }
}

// 🔹 Exemplo de integração com API (OpenAI / ChatGPT)
export async function analisarCriqueteAPI(confronto, mercado, competicao, odd, apiKey) {
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
        { role: "system", content: "Você é um analista esportivo especialista em críquete e apostas esportivas." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 800,
    }),
  });

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "❌ Erro: resposta vazia da API.";
}
