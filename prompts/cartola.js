// prompts/cartola.js

import { getMercadoCartola } from "../lib/cartola.js";

export async function gerarPrompt(tipo, orcamento, posicao) {
  
  // Carrega os dados reais do Cartola
  const jogadores = await getMercadoCartola();

  return `
⚽ **ANÁLISE CARTOLA FC – Modo Betgram**

Use os dados reais fornecidos abaixo para montar a análise.
Sempre considere:

- Preço (cartoletas)
- Média de pontuação
- Valorização
- Regularidade
- Posição
- Chances de jogar
- Custo-benefício real

=========================================
📘 **TIPO DE ANÁLISE SOLICITADA:** ${tipo}
💰 **Orçamento:** ${orcamento || "Sem limite"}
🧩 **Posição desejada:** ${posicao || "(todas)"}
=========================================

### 📝 **BASE DE DADOS OFICIAL CARTOLA**
Aqui estão TODOS os jogadores do mercado **em JSON real**. 
Use isso como banco de dados:

\`\`\`json
${JSON.stringify(jogadores, null, 2)}
\`\`\`

=========================================
### 🎯 INSTRUÇÕES PARA A IA

1. Leia toda a lista JSON acima.
2. Filtre apenas a posição solicitada (se houver).
3. Aplique o orçamento (se houver).
4. Para cada tipo de análise, siga a regra:

---

### 🧠 Regras por modo:

#### **1) Montar time completo**
- Escale 11 jogadores + 1 técnico  
- Respeite orçamento  
- Priorize custo-benefício  
- Evite jogadores duvidosos/lesionados

#### **2) Melhor jogador por posição**
- Escolha 1 por posição  
- Baseie em média + regularidade + próximo confronto  

#### **3) Melhor custo-benefício**
- Jogadores baratos que pontuam MUITO  

#### **4) Baratos que pontuam bem**
- Lista de jogadores até 10 cartoletas  
- Média acima da média da posição  

#### **5) Valorização**
- Jogadores com grande chance de valorizar  
- Basear na regra de valorização do Cartola  

#### **6) Sugestões por orçamento**
- Crie times possíveis com o orçamento fornecido  

#### **7) Melhor capitão**
- Escolha baseado em média + regularidade + confronto fácil  

---

### 🏁 **FORMATO DA RESPOSTA (OBRIGATÓRIO)**

A IA deve retornar:

- 🔥 Destaques principais  
- 📝 Mini justificativas curtas  
- 💰 Preço de cada jogador  
- ⭐ Média e valorização  
- 🧠 Por que ele é boa opção  

E no final:

### ✔ Melhor time / melhores opções da rodada  
### ✔ Melhor capitão  

---

Agora gere a análise COMPLETA com base nisso.
`;
}
