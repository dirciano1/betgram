// prompts/ciclismo.js
// 🔹 Módulo para gerar prompt de análise de Ciclismo (Tour de France, Giro, Vuelta, etc.)
// Estruturado para integração direta com API (OpenAI, Gemini, etc.)

export function gerarPrompt(confronto, mercado, competicao, odd) {
  if (mercado) {
    // === Prompt ESPECÍFICO (mercado + odd opcional) ===
    return `ChatGPT, analise o mercado de ${mercado} para o confronto ${confronto} no Ciclismo, válido pela competição ${competicao || 'não especificada'}.
${odd ? `A odd oferecida é ${odd}. Avalie se essa odd representa bom valor ou está abaixo do ideal considerando perfil da etapa, condição dos ciclistas e desempenho recente.` : ''}

Considere:
🚴‍♂️ Perfil da etapa (plana, montanhosa, contrarrelógio, mista);
⛰️ Dificuldade e altimetria total;
💨 Condições climáticas (vento, chuva, temperatura);
👥 Estratégia e força das equipes (apoio, domestiques, gregários);
🔥 Desempenho recente dos ciclistas em provas similares;
📊 Histórico entre os principais competidores;
🕒 Forma física atual e recuperação após etapas duras;
🧠 Táticas de corrida (ataques, sprint final, pacing, fuga).

Indique:
1. A probabilidade real estimada de o evento ocorrer;
2. A odd mínima justa para representar valor esperado positivo;
3. Uma recomendação de aposta e justificativa técnica;
4. Um mercado alternativo com bom valor esperado, se houver.`;
  } else {
    // === Prompt GERAL (todos os mercados) ===
    return `ChatGPT, analise todos os mercados de aposta disponíveis para o confronto ${confronto} no Ciclismo, válido pela competição ${competicao || 'não especificada'}.

Considere os principais grupos de mercado:

🏆 **Resultado Geral**
- Vencedor da Etapa;
- Vencedor Geral da Prova (Classificação Geral);
- Pódio (Top 3, Top 5, Top 10);
- Vencedor de Classificação de Montanha;
- Vencedor de Classificação por Pontos (sprint);
- Vencedor de Classificação de Jovens;
- Melhor Equipe.

🕒 **Etapas e Segmentos**
- Vencedor da Etapa Específica;
- Melhor tempo em contrarrelógio (Time Trial Winner);
- Primeiro a atingir ponto de montanha (KOM);
- Melhor em Sprint Intermediário;
- Time que vence a Etapa por Equipes.

⚔️ **Head-to-Head (Duelo Direto)**
- Qual ciclista terminará à frente do outro (1x1);
- Diferença de tempo entre dois ciclistas (O/U segundos);
- Ambos terminam a prova (Sim/Não).

🎯 **Totais e Over/Under**
- Tempo total do vencedor da etapa (O/U);
- Diferença entre 1º e 2º lugar (O/U segundos);
- Número de ciclistas da equipe no Top 10 (O/U);
- Quantidade de quedas, abandonos ou DNF (Sim/Não).

💥 **Especiais e Props**
- Vencedor de etapa vence também classificação geral (Sim/Não);
- Ciclista lidera após etapa X (Sim/Não);
- Líder mantém camisa amarela (Sim/Não);
- Margem de vitória no geral (1–10s, 11–30s, 31–60s, etc.);
- Nacionalidade do vencedor (Itália, França, Eslovênia, etc.);
- Vence por sprint ou ataque solo.

🌦️ **Fatores Estratégicos**
- Condição climática (vento lateral, chuva, temperatura);
- Tipo de terreno e altitude;
- Estratégia das equipes (fuga, controle de ritmo, apoio);
- Resistência e recuperação dos ciclistas após etapas duras;
- Histórico em provas de 3 semanas (Grand Tours);
- Moral e motivação após resultados recentes.

Para cada grupo, indique:
1. O mercado mais provável de sucesso;
2. A odd mínima justa para representar valor positivo;
3. A aposta principal com justificativa tática e contextual;
4. Um mercado alternativo com bom valor esperado.

Finalize com um resumo destacando:
- 🟩 A aposta mais segura (alta probabilidade);
- 🟥 A aposta mais arriscada (alto potencial de retorno).`;
  }
}

// 🔹 Exemplo de integração com API (ChatGPT ou similar)
export async function analisarCiclismoAPI(confronto, mercado, competicao, odd, apiKey) {
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
        { role: "system", content: "Você é um analista esportivo especialista em ciclismo e apostas esportivas." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 800,
    }),
  });

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "❌ Erro: resposta vazia da API.";
}
