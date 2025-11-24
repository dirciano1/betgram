// ===============================
//  PROMPT CARTOLA FC — BETGRAM
//  Defesa | Meio | Ataque | Técnico
// ===============================

function montarPromptBase(tipo, orcamento, posicao, rodada) {
  return `
⚠️ INSTRUÇÃO SISTÊMICA — NÃO MOSTRAR NA RESPOSTA ⚠️
Você é a IA da Betgram, especialista em Cartola FC.
- Sempre use dados plausíveis da temporada atual.
- Considere média, valorização, custo e desempenho recente.
- Não invente estatísticas irreais.
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
export function gerarPromptDefesa(orcamento, posicao, rodada) {
  return `
${montarPromptBase("DEFESA (GOL + ZAG)", orcamento, posicao, rodada)}

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
export function gerarPromptMeio(orcamento, posicao, rodada) {
  return `
${montarPromptBase("MEIO + LATERAIS (MEI + LAT)", orcamento, posicao, rodada)}

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
// ATAQUE — ATA + CAPITÃO
// ===============================
export function gerarPromptAtaque(orcamento, posicao, rodada) {
  return `
${montarPromptBase("ATAQUE (ATA + CAPITÃO)", orcamento, posicao, rodada)}

🎯 OBJETIVO:
Selecionar:
- Atacantes (ATA)
- Melhor Capitão (CAP)

⭐ Considere:
• Finalizações
• Gols
• Participação ofensiva
• Confronto
• Média recente

💡 Entrega:
- Top 3 atacantes
- 1 barato com potencial
- Melhor capitão com justificativa forte
`.trim();
}

// ===============================
// TÉCNICO — INDIVIDUAL
// ===============================
export function gerarPromptTecnico(orcamento, rodada) {
  return `
${montarPromptBase("TÉCNICO (INDIVIDUAL)", orcamento, "TEC", rodada)}

🎯 OBJETIVO:
Escolher o melhor técnico para a rodada.

⭐ Considere:
• Chances de SG
• Potencial ofensivo do time
• Regularidade na pontuação
• Custo-benefício

💡 Entrega:
- Top 3 técnicos
- 1 técnico barato
- Melhor técnico geral com justificativa
`.trim();
}

// ===============================
// FUNÇÃO PRINCIPAL
// ===============================
export function gerarPrompt(tipo, orcamento, posicao, rodada) {
  switch (tipo) {
    case "defesa":
      return gerarPromptDefesa(orcamento, posicao, rodada);

    case "meio":
      return gerarPromptMeio(orcamento, posicao, rodada);

    case "ataque":
      return gerarPromptAtaque(orcamento, posicao, rodada);

    case "tecnico":
      return gerarPromptTecnico(orcamento, rodada);

    default:
      return "Erro: tipo inválido no prompt Cartola.";
  }
}
