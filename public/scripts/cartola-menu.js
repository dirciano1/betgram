// ==========================================
//  🟢 CARTOLA MENU — BetGram
//  Controle dinâmico de inputs via seletor
// ==========================================
console.log("🔥 SCRIPT CARTOLA CARREGOU!");
// Aguarda DOM carregar
document.addEventListener("DOMContentLoaded", () => {
  const intervalo = setInterval(() => {
    // garante que o select React já carregou
    if (typeof window.__ESPORT_SELECTED === "undefined") return;

    ativarSistemaCartola();
    clearInterval(intervalo);
  }, 300);
});

function ativarSistemaCartola() {
  console.log("Cartola-menu.js ativo ✔");

  // Captura os elementos da página
  const blocoCompeticao = document.querySelector("#bloco-competicao");
  const blocoAno = document.querySelector("#bloco-ano");
  const blocoConfronto = document.querySelector("#bloco-confronto");
  const blocoMercado = document.querySelector("#bloco-mercado");
  const botaoAnalisar = document.querySelector("#botao-analisar");

  // Cria o bloco Cartola FC dinamicamente
  const blocoCartola = criarBlocoCartola();
  document.body.appendChild(blocoCartola);
  blocoCartola.style.display = "none";

  // Observa mudança no select
  setInterval(() => {
    const esporte = window.__ESPORT_SELECTED;

    if (esporte === "cartola") {
      // esconder inputs padrões
      if (blocoCompeticao) blocoCompeticao.style.display = "none";
      if (blocoAno) blocoAno.style.display = "none";
      if (blocoConfronto) blocoConfronto.style.display = "none";
      if (blocoMercado) blocoMercado.style.display = "none";
      if (botaoAnalisar) botaoAnalisar.style.display = "none";

      // mostrar bloco cartola
      blocoCartola.style.display = "block";

    } else {
      if (blocoCompeticao) blocoCompeticao.style.display = "flex";
      if (blocoAno) blocoAno.style.display = "block";
      if (blocoConfronto) blocoConfronto.style.display = "block";
      if (blocoMercado) blocoMercado.style.display = "block";
      if (botaoAnalisar) botaoAnalisar.style.display = "flex";

      blocoCartola.style.display = "none";
    }
  }, 300);
}

// ==================================================
//  🧩 BLOCO CARTOLA — Criado totalmente via JS
// ==================================================
function criarBlocoCartola() {
  const div = document.createElement("div");
  div.id = "bloco-cartola";
  div.style.cssText = `
    margin-top:20px;
    padding:16px;
    background:rgba(11,19,36,0.7);
    border:1px solid rgba(34,197,94,0.3);
    border-radius:12px;
    color:#fff;
    max-width:700px;
    margin-left:auto;
    margin-right:auto;
  `;

  div.innerHTML = `
      <h3 style="color:#22c55e;margin-bottom:14px;">🟢 Cartola FC — Montador de Time</h3>

      <label style="display:block;margin-bottom:8px;">💰 Valor disponível para gastar:</label>
      <input id="cartola-valor" type="number" placeholder="Ex: 30 cartoletas"
        style="width:100%;padding:10px;border-radius:10px;border:1px solid rgba(255,255,255,0.15);
        background:rgba(17,24,39,0.8);color:#fff;margin-bottom:14px;outline:none;">

      <label style="display:block;margin-bottom:8px;">🎯 Escolher posição desejada:</label>
      <select id="cartola-posicao" 
        style="width:100%;padding:10px;border-radius:10px;border:1px solid rgba(255,255,255,0.15);
        background:rgba(17,24,39,0.8);color:#fff;margin-bottom:14px;outline:none;">
        <option value="atacante">Atacante</option>
        <option value="meia">Meia</option>
        <option value="zagueiro">Zagueiro</option>
        <option value="lateral">Lateral</option>
        <option value="goleiro">Goleiro</option>
        <option value="tecnico">Técnico</option>
        <option value="time-completo">Montar time completo</option>
      </select>

      <button id="cartola-gerar" 
        style="width:100%;padding:12px;border-radius:10px;
        background:linear-gradient(90deg,#22c55e,#16a34a);color:#fff;font-weight:700;
        cursor:pointer;margin-top:5px;">
        ⚽ Gerar Sugestões
      </button>
  `;

  // Quando clicar — substitui o botão Analisar
  div.querySelector("#cartola-gerar").onclick = () => {
    const valor = document.querySelector("#cartola-valor").value;
    const pos = document.querySelector("#cartola-posicao").value;

    if (!valor) {
      alert("Informe o valor disponível!");
      return;
    }

    window.alert(
      `Cartola FC ativado!\n\nValor: ${valor}\nPosição: ${pos}\n\n(Agora a IA vai gerar as recomendações no arquivo prompts/cartola.js)`
    );
  };

  return div;
}
