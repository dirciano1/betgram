console.log("🔥 SCRIPT CARTOLA CARREGADO!");

// ---- Função segura para esconder mantendo layout bonito ----
function esconderElemento(el) {
  if (!el) return;
  el.style.visibility = "hidden";
  el.style.height = "0";
  el.style.margin = "0";
  el.style.padding = "0";
  el.style.overflow = "hidden";
}

// ---- Função segura para mostrar ----
function mostrarElemento(el) {
  if (!el) return;
  el.style.visibility = "visible";
  el.style.height = "";
  el.style.margin = "";
  el.style.padding = "";
  el.style.overflow = "";
}

// ---- Observa o valor selecionado ----
function aplicarLayoutPorEsporte() {
  const esporte = window.__ESPORT_SELECTED;

  const blocoCompeticao = document.getElementById("bloco-competicao");
  const blocoConfronto   = document.getElementById("bloco-confronto");
  const blocoMercado     = document.getElementById("bloco-mercado");
  const botaoAnalisar    = document.getElementById("botao-analisar");

  if (esporte === "cartola") {
    console.log("🟢 MODO CARTOLA ATIVADO");

    esconderElemento(blocoCompeticao);
    esconderElemento(blocoConfronto);
    esconderElemento(blocoMercado);

  } else {
    console.log("⚽ MODO NORMAL ATIVADO");

    mostrarElemento(blocoCompeticao);
    mostrarElemento(blocoConfronto);
    mostrarElemento(blocoMercado);
  }
}

// ---- A cada 400ms atualiza a interface ----
setInterval(aplicarLayoutPorEsporte, 400);
