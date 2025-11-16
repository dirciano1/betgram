// prompts/global.js

export function gerarContextoGlobal(confronto) {
  return `
Antes de gerar qualquer análise, PESQUISE NA INTERNET os resultados mais recentes dos times envolvidos no confronto abaixo.

===========================
📌 REGRAS PARA COLETA DE DADOS (OBRIGATÓRIO)
===========================

1. Pesquise os JOGOS MAIS RECENTES de cada time.
2. Use um limite de ATÉ 30 jogos.
3. Se não existirem 30 jogos disponíveis:
   - Utilize quantos existirem (ex.: 6, 12, 18, 22…)
4. NUNCA invente partidas.
5. Priorize sempre os jogos mais recentes.
6. Inclua jogos oficiais:
   - Ligas nacionais
   - Copas nacionais
   - Copas internacionais
7. Ignore amistosos, exceto se forem os únicos dados disponíveis.

===========================
📊 DADOS A SEREM EXTRAÍDOS
===========================

Para cada jogo encontrado, extraia:

• Data  
• Competição  
• Placar final  
• Time jogando em Casa/Fora  
• Situação (Vitória / Empate / Derrota)  
• Gols marcados  
• Gols sofridos  

Depois gere estatísticas combinadas:

• Média de gols marcados (últimos jogos)  
• Média de gols sofridos  
• % BTTS (ambos marcam)  
• % Over 0.5, 1.5, 2.5, 3.5  
• % Under  
• Forma recente (V/E/D nos últimos 5 e 10 jogos)  
• Tendências claras de cada time  
• Performance como mandante e visitante  

===========================
📘 CONTEXTO DO CONFRONTO
===========================

Confronto: ${confronto}

===========================
📌 IMPORTANTE
===========================

Antes de gerar qualquer conclusão, você DEVE montar:
- a lista de jogos,
- as médias,
- as porcentagens,
- e as tendências reais.

Depois, utilize esse contexto estatístico REAL como base para a análise técnica do esporte correspondente no padrão Betgram IA.
`;
}
