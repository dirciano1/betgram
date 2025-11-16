// prompts/global.js
export function gerarContextoGlobal(confronto) {
  return `
ANTES DE QUALQUER ANÁLISE:  
✓ Realize PESQUISAS NA INTERNET usando Google Search.  
✓ Coletar ATÉ 30 jogos mais recentes de cada time do confronto: **${confronto}**.  
✓ Esses dados são APENAS PARA CONTEXTO INTERNO.  
⚠️ NUNCA exiba essa lista de partidas na resposta final.

===========================
📌 REGRAS PARA COLETA DE DADOS
===========================

1. Buscar jogos OFICIAIS (ligas e copas).  
2. Ignorar amistosos, exceto se forem os únicos disponíveis.  
3. Nunca inventar jogos.  
4. Priorizar jogos mais recentes.
5. Extrair para uso interno:
   - Data  
   - Competição  
   - Placar  
   - Casa/Fora  
   - Vitória/Empate/Derrota  
   - Gols marcados  
   - Gols sofridos  

===========================
⚠️ IMPORTANTE
===========================
- Os dados coletados DEVEM influenciar a análise final.  
- Mas **não devem ser exibidos na resposta**.  
- A resposta final deve seguir o formato do arquivo do esporte (ex.: futebol.js).  
`;
}
