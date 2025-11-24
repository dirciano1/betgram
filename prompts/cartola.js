// ===============================
//  PROMPT CARTOLA FC — BETGRAM
//  Defesa | Meio | Ataque | Técnico
//  Agora com jogadores reais
// ===============================

function montarPromptBase(tipo, orcamento, posicao, rodada, jogadores) {
  return `
⚠️ INSTRUÇÃO SISTÊMICA — NÃO MOSTRAR NA RESPOSTA ⚠️
Você é a IA da Betgram, especialista em Cartola FC.
- Use **somente os jogadores fornecidos na lista abaixo**.
- NÃO invente nomes.
- NÃO use jogadores que não estão na lista.
- Considere média, custo, valorização, fase recente e confronto.
- Dados devem ser PLAUSÍVEIS e baseados na lista.
- Nunca use informações antigas.

=== CONTEXTO ===
• Tipo: ${tipo}
• Orçamento: ${orcamento ? orcamento + " cartoletas" : "não informado"}
• Filtro de posição: ${posicao || "todos"}
• Rodada: ${rodada || "atual"}

=== LISTA REAL DE JOGADORES ===
${JSON.stringify(jogadores, null, 2)}

Agora gere a análise.
`.trim();
}

// ===============================
// DEFESA — GOL + ZAG
// ===============================
export function gerarPromptDefesa(orcamento, posicao, rodada, jogadores) {
  return `
${montarPromptBase("DEFESA (GOL + ZAG)", orcamento, posicao, rodada, jogadores)}

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
${montarPromptBase("MEIO + LATERAIS (MEI + LAT)", orcamento, posicao, rodada, jogadores)}

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
export function gerarPromptAtaque(orcamento, posicao, rodada, jogadores) {
  return `
${montarPromptBase("ATAQUE (ATA + CAPITÃO)", orcamento, posicao, rodada, jogadores)}

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
export function gerarPromptTecnico(orcamento, rodada, jogadores) {
  return `
${montarPromptBase("TÉCNICO (INDIVIDUAL)", orcamento, "TEC", rodada, jogadores)}

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
export function gerarPrompt(tipo, orcamento, posicao, rodada, jogadores) {
  switch (tipo) {
    case "defesa":
      return gerarPromptDefesa(orcamento, posicao, rodada, jogadores);

    case "meio":
      return gerarPromptMeio(orcamento, posicao, rodada, jogadores);

    case "ataque":
      return gerarPromptAtaque(orcamento, posicao, rodada, jogadores);

    case "tecnico":
      return gerarPromptTecnico(orcamento, rodada, jogadores);

    default:
      return "Erro: tipo inválido no prompt Cartola.";
  }
}
