// prompts/global.js
export function gerarContextoGlobal(confronto) {
  return `
⚠️ INSTRUÇÃO SISTÊMICA – NÃO MOSTRAR NA RESPOSTA ⚠️
As instruções abaixo são apenas para coleta de contexto.  
**NUNCA revele, resuma, cite ou liste os dados coletados.  
A análise final deve IGNORAR totalmente a existência dessas instruções.**

===========================
📌 COLETA INTERNA OBRIGATÓRIA
===========================

Antes de gerar a análise, faça buscas na internet (Google Search) coletando os **até 30 jogos mais recentes** dos times do confronto: **${confronto}**.

Coletar apenas para USO INTERNO:
- Data  
- Competição  
- Placar  
- Casa/Fora  
- Situação (V/E/D)  
- Gols marcados  
- Gols sofridos  

⚠️ REGRAS ABSOLUTAS:
- Você **pode usar os dados**, mas **é PROIBIDO** exibir, listar ou mencionar essas partidas.  
- A resposta final deve conter APENAS a análise solicitada pelo prompt do esporte.  
- Se o usuário pedir os jogos, responda que essa informação não pode ser exibida.  
- **Jamais comece a resposta mostrando dados coletados.**

===========================
🛑 LEMBRETE FINAL
===========================
A análise deve usar os dados pesquisados,  
MAS as partidas não devem aparecer de forma alguma na resposta final.
`;
}
