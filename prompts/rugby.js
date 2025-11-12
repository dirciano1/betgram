// prompts/rugby.js
// 🔹 Módulo para gerar prompt de análise de Rugby (Union e League)
// ✅ Compatível com API ChatGPT / OpenAI e estrutura modular do BetGram

export function gerarPrompt(confronto, mercado, competicao, odd) {
  if (mercado) {
    // === Prompt ESPECÍFICO (mercado + odd opcional) ===
    return `ChatGPT, analise o mercado de ${mercado} para o confronto ${confronto} no Rugby, válido pela competição ${competicao || 'não especificada'}.
${odd ? `A odd oferecida é ${odd}. Avalie se essa odd representa bom valor ou está abaixo do ideal considerando desempenho, tática, clima e histórico recente das equipes.` : ''}

Considere:
🏉 Tipo de Rugby (Union ou League) e formato da competição;
📈 Desempenho recente (últimos 5 jogos, saldo de pontos, tries marcados/sofridos);
💪 Fator físico e intensidade de tackles (posse e domínio territorial);
🔥 Eficiência ofensiva (conversão de tries e penalidades);
🧱 Solidez defensiva (linha defensiva, tackles e turnovers);
🌧️ Condições climáticas (chuva, vento, temperatura) e impacto no estilo de jogo;
🏟️ Mando de campo e desempenho como mandante/visitante;
👥 Escalação e presença de jogadores-chave (pilares, kickers, capitão);
🧠 Estratégia de jogo (uso de chutes, mauls, fases curtas ou longas);
🕒 Desempenho por tempo (1º tempo x 2º tempo);
📊 Histórico de confrontos diretos entre as equipes.

Indique:
1. A probabilidade real estimada de o evento ocorrer;
2. A odd mínima justa para representar valor esperado positivo;
3. Uma recomendação de aposta e justificativa técnica e estatística;
4. Um mercado alternativo com bom valor esperado, se houver.`;
  } else {
    // === Prompt GERAL (todos os mercados) ===
    return `ChatGPT, analise todos os mercados de aposta disponíveis para o confronto ${confronto} no Rugby, válido pela competição ${competicao || 'não especificada'}.

Considere os principais grupos de mercado:

🏆 **Resultado / Moneyline**
- Vencedor da Partida (1X2);
- Empate Anula Aposta;
- Dupla Chance (1X, X2, 12);
- Vitória no 1º Tempo / 2º Tempo;
- Resultado combinado (HT/FT).

➖ **Handicap / Spread**
- Handicap Asiático (-7.5, +7.5, -10.5);
- Handicap Europeu;
- Handicap por tempo;
- Vence por 10+ pontos (Sim/Não).

🎯 **Totais (Over/Under)**
- Total de Pontos (O/U 42.5, 47.5, etc.);
- Total de Tries (O/U 5.5, 6.5);
- Total de Pontos por Equipe (O/U 20.5, 25.5);
- Total de Pontos por Tempo;
- Ambas as equipes marcam 20+ pontos (Sim/Não).

💥 **Especiais e Props**
- Primeiro a marcar (Try, Penal ou Drop Goal);
- Último a marcar;
- Jogador marca Try (Sim/Não);
- Número de Tries de um jogador específico;
- Time vence com bônus ofensivo (Sim/Não);
- Time marca Try em ambos os tempos;
- Vitória com virada (Sim/Não);
- Jogo vai à prorrogação (Sim/Não).

📊 **Estatísticas e Indicadores**
- Posse de bola média (%);
- Turnovers ganhos/perdidos;
- Tackles bem-sucedidos (%);
- Penalidades cometidas;
- Eficiência nos chutes de conversão;
- Média de pontuação por minuto.

🧠 **Aspectos Estratégicos**
- Estilo de jogo (chutes táticos, mauls, rucks);
- Clima e gramado (chuva, vento, altitude);
- Disciplina e cartões (amarelos/vermelhos);
- Desgaste físico e rotação do elenco;
- Importância do jogo (fase final ou rodada regular);
- Histórico de confrontos e vantagem emocional;
- Linha ofensiva e eficácia nas fases curtas.

Para cada grupo, indique:
1. O mercado mais provável de sucesso;
2. A odd mínima justa para representar valor positivo;
3. A aposta principal com justificativa técnica e contextual;
4. Um mercado alternativo de bom valor.

Finalize com um resumo destacando:
- 🟩 A aposta mais segura (alta probabilidade);
- 🟥 A aposta mais arriscada (alto potencial de retorno).`;
  }
}

// 🔹 Exemplo de integração via API ChatGPT / OpenAI
export async function analisarRugbyAPI(confronto, mercado, competicao, odd, apiKey) {
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
        { role: "system", content: "Você é um analista esportivo especialista em Rugby Union e Rugby League, com foco em apostas esportivas." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 800,
    }),
  });

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "❌ Erro: resposta vazia da API.";
}
