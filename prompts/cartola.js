// ================================
//  MAPA COMPLETO DE CLUBES CARTOLA
// ================================
const CLUBES = {
  262: "Flamengo",
  263: "Grêmio",
  264: "Internacional",
  265: "Corinthians",
  266: "Palmeiras",
  267: "São Paulo",
  275: "Athletico-PR",
  276: "Coritiba",
  277: "Cruzeiro",
  278: "Atlético-MG",
  279: "Bahia",
  280: "Vitória",
  281: "Ceará",
  282: "Fortaleza",
  283: "Santos",
  284: "Botafogo",
  285: "Vasco",
  286: "Fluminense",
  287: "América-MG",
  288: "Chapecoense",
  289: "Atlético-GO",
  290: "Goiás",
  291: "Juventude",
  292: "Cuiabá",
  293: "RB Bragantino",

  // Times que podem aparecer em bases complementares
  294: "Sport",
  295: "Náutico",
  296: "Santa Cruz",
  297: "Avaí",
  298: "Figueirense",
  299: "Joinville",
  300: "Paraná",
  301: "Londrina",
  302: "Paysandu",
  303: "Remo",
  304: "Sampaio Corrêa",
  305: "ABC",
  306: "América-RN",
  307: "CRB",
  308: "CSA",
  309: "Botafogo-SP",
  310: "Ponte Preta",
  311: "Guarani",
  312: "Ituano",
  313: "Novorizontino",
  314: "Mirassol",
  315: "Operário-PR",
  316: "Vila Nova",
  317: "Tombense",
  318: "São Bernardo",
  319: "Ferroviária",
  320: "Ypiranga-RS",
  321: "Caxias",
  322: "Volta Redonda",
  323: "Boavista-RJ",
  324: "Portuguesa",
  325: "Oeste",
  326: "XV de Piracicaba",
  327: "São José-RS",
  328: "Manaus",
  329: "Altos",
  330: "Confiança",
  331: "Paysandu",
  332: "Remo"
};

// ===========================================
// Função para converter ID → Nome do Clube
// ===========================================
function nomeDoClube(id) {
  return CLUBES[id] || "Clube Desconhecido";
}

// ===========================================
// Função que monta o texto dos atacantes
// Já integrada ao seu prompt Betgram
// ===========================================
function montarAnaliseAtacantes(jogadores) {
  let texto = "Como especialista em Cartola FC da Betgram, analisei a lista de atacantes fornecida para a rodada atual, considerando média, custo e potencial.\n\n";
  texto += "### Top 3 Atacantes para a Rodada:\n\n";

  jogadores.slice(0, 3).forEach((jogador, index) => {
    const time = nomeDoClube(jogador.clube_id);
    texto += `${index + 1}. **${jogador.nome} – ${time}** (ID: ${jogador.clube_id})  
Média: **${jogador.media}** — Preço: **C$${jogador.preco}**\n\n`;
  });

  if (jogadores.length > 3) {
    const barato = jogadores[3];
    texto += `### Atacante Barato com Potencial:\n\n`;
    texto += `* **${barato.nome} – ${nomeDoClube(barato.clube_id)}**  
Custa apenas **C$${barato.preco}** e tem média de **${barato.media}**.\n`;
  }

  return texto;
}

// ===========================================
// Exemplo de uso no seu código:
// montarAnaliseAtacantes(listaDeAtacantes)
// ===========================================

export { CLUBES, nomeDoClube, montarAnaliseAtacantes };
