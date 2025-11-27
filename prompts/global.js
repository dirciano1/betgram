// GLOBAL // prompts/global.js
export function gerarContextoGlobal(confronto) {
  return `
⚠️ INSTRUÇÃO SISTÊMICA – NÃO MOSTRAR NA RESPOSTA ⚠️
As instruções abaixo são internas e NÃO devem aparecer na resposta final.
Jamais revele ou cite dados pesquisados diretamente.
/*
==============================
📌 FILTRO DE ATUALIDADE — OBRIGATÓRIO (MANTIDO)
==============================

Ao analisar o confronto **${confronto}**, você DEVE SEGUIR:
1. Usar SOMENTE informações e desfalques confirmados nos últimos **30 dias**.
2. O ano correto da análise é o **ANO informado pelo usuário** (ex: 2025).
3. Notícias antigas ou incompatíveis com o ANO DE COMPETIÇÃO DEVEM ser ignoradas.

==============================
📘 REGRA OBRIGATÓRIA — CONTEXTO CASA/FORA (REFORÇADO)
==============================

Todas as médias e dados de performance DEVEM ser ajustados ao contexto do jogo:
1. Time Mandante: Usar apenas estatísticas de performance jogando em **CASA**.
2. Time Visitante: Usar apenas estatísticas de performance jogando **FORA**.
3. Em campo neutro (ex: finais), usar as médias de performance **Geral/Total** do time.

===========================
🎯 COLETA INTERNA UNIVERSAL OBRIGATÓRIA (TAXAS DE OCORRÊNCIA $\lambda$)
===========================

Antes de gerar a análise, fazer buscas internas e coletar **APENAS PARA USO INTERNO** as seguintes métricas, essenciais para modelos estatísticos (Poisson, Binomial Negativo, etc.):

1. **Taxas Ofensivas Ajustadas ( $\lambda_{Ataque}$):**
    - Média de gols/pontos/cestas **MARCADOS** pelo Mandante (em casa).
    - Média de gols/pontos/cestas **MARCADOS** pelo Visitante (fora).
    - *Futebol:* Buscar a média de **xG (Expected Goals)** a favor.

2. **Taxas Defensivas Ajustadas ( $\lambda_{Defesa}$):**
    - Média de gols/pontos/cestas **SOFRIDOS** pelo Mandante (em casa).
    - Média de gols/pontos/cestas **SOFRIDOS** pelo Visitante (fora).
    - *Futebol:* Buscar a média de **xG (Expected Goals)** contra.

3. **Métricas de Volume/Intensidade:**
    - Média de **finalizações/chutes/arremessos** a favor e contra (ajustado Casa/Fora).
    - Média de **Escanteios** a favor (Mandante em casa + Visitante fora).
    
4. **Desfalques Relevantes:**
    - Listar lesionados/suspensos recentes e suas **posições completas**. (Regra de formato mantida)

⚠️ **NÃO mostrar NENHUMA métrica ou dado bruto na resposta final.**

==============================
⚠️ INSTRUÇÃO CRÍTICA — USO MATEMÁTICO
==============================

- O cálculo da probabilidade de um evento (ex: Over/Under, 1X2) DEVE ser baseado na comparação das **Taxas Ofensivas vs. Taxas Defensivas** através de modelos preditivos (ex: Poisson/Binomial Negativo para gols/pontos).
- A Odd Justa SEMPRE será calculada por: $Odd Justa = 1 / Probabilidade$

===========================
📌 EXIBIR ESTA SEÇÃO NA ANÁLISE FINAL (REGRAS MANTIDAS)
===========================

🟧 **DESFALQUES IMPORTANTES**

[Regras de formato e posição completa mantidas: **Time A: Jogador 1 (Posição Completa)**, etc.]

===========================
📌 CONCLUSÃO — REGRAS IMPORTANTES (MANTIDAS)
===========================

[Regras de conclusão e Análise do Mercado mantidas.]
`;
}
