// ===============================
//  PROMPT CARTOLA FC — BETGRAM
//  Defesa | Meio | Ataque
// ===============================

function montarPromptBase(tipo, orcamento, posicao, rodada) {
  return `
⚠️ INSTRUÇÃO SISTÊMICA — NÃO MOSTRAR NA RESPOSTA ⚠️
Você é a IA da Betgram, especialista em Cartola FC.
- Sempre use dados plausíveis da temporada atual.
- Considere média, valorização, custo e desempenho recente.
- Nunca invente estatísticas irreais.
- Sempre mantenha coerência com o Cartola atual.
- Evite notícias antigas.
- Seja direto, organizado e muito objetivo.

=== CONTEXTO ===
• Tipo: ${tipo}
• Orçamento: ${orcamento ? orcamento + " cartoletas" : "não informado"}
• Filtro de posição: ${posicao || "nenhum"}
• Rodada: ${rodada || "atual"}

Agora gere a análise.
`.trim();
}

// ===============================
// DEFESA — GOL + ZAG
// ===============================
export function gerarPromptDefesa(orcamento, posicao, rodada, jogadores) {
  return `
${montarPromptBase("DEFESA (GOL + ZAG)", orcamento, posicao, rodada)}

📌 LISTA REAL DE JOGADORES (use somente estes):
${JSON.stringify(jogadores)}

🎯 OBJETIVO:
Selecionar os melhores defensores:
- Goleiros (GOL)
- Zagueiros (ZAG)

⭐ Considere:
• SG (saldo de gols)
• Defesa difícil
• Regularidade
• Adversário
• Média recente
• Custo-benefício

💡 Entrega:
- Top 3 goleiros
- Top 3 zagueiros
- 1 opção barata
- Defesa ideal com justificativa
`.trim();
}

// ===============================
// MEIO + LATERAIS
// ===============================
export function gerarPromptMeio(orcamento, posicao, rodada, jogadores) {
  return `
${montarPromptBase("MEIO + LATERAIS (MEI + LAT)", orcamento, posicao, rodada)}

📌 LISTA REAL DE JOGADORES (use somente estes):
${JSON.stringify(jogadores)}

🎯 OBJETIVO:
Selecionar:
- Meias (MEI)
- Laterais (LAT)

⭐ Considere:
• Assistências
• Finalizações
• Desarmes
• Ofensividade
• Potencial de valorização

💡 Entrega:
- Top 3 laterais
- Top 3 meias
- 1 barato diferenciado
- Seleção ideal com justificativa
`.trim();
}

// ===============================
// ATAQUE — ATA
// ===============================
export function gerarPromptAtaque(orcamento, posicao, rodada, jogadores) {
  return `
${montarPromptBase("ATAQUE (ATA)", orcamento, posicao, rodada)}

📌 LISTA REAL DE JOGADORES (use somente estes):
${JSON.stringify(jogadores)}

🎯 OBJETIVO:
Selecionar:
- Atacantes (ATA)

⭐ Considere:
• Finalizações
• Gols
• Participação ofensiva
• Confronto
• Média recente

💡 Entrega:
- Top 3 atacantes
- 1 barato com potencial
`.trim();
}

// ===============================
// FUNÇÃO PRINCIPAL
// ===============================
export function gerarPrompt(tipo, orcamento, posicao, rodada, jogadores) {
  switch (tipo) {
    case "defesa":
      return gerarPromptDefesa(orcamento, posicao, rodada, jogadores);

    case "meio":
      return gerarPromptMeio(orcamento, posicao, rodada, jogadores);

    case "ataque":
      return gerarPromptAtaque(orcamento, posicao, rodada, jogadores);

    default:
      return "Erro: tipo inválido no prompt Cartola.";
  }
}
