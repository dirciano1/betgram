console.log("🔥 CARTOLA MODE SCRIPT LOADED");

// Funções seguras de esconder/mostrar sem quebrar layout
function esconderElemento(el) {
  if (!el) return;
  el.style.visibility = "hidden";
  el.style.height = "0px";
  el.style.margin = "0";
  el.style.padding = "0";
  el.style.overflow = "hidden";
}

function mostrarElemento(el) {
  if (!el) return;
  el.style.visibility = "visible";
  el.style.height = "";
  el.style.margin = "";
  el.style.padding = "";
  el.style.overflow = "";
}

// controla o comportamento do bloco de posição no cartola
function atualizarPosicaoCartola() {
  const tipo = document.getElementById("cartola-tipo");
  const posicao = document.getElementById("cartola-posicao");
  if (!tipo || !posicao) return;

  const modo = tipo.value;

  // só mostra posição nos modos que fazem sentido
  if (modo === "melhor-posicao" || modo === "custo-beneficio") {
    mostrarElemento(posicao.parentElement);
  } else {
    esconderElemento(posicao.parentElement);
  }
}

function aplicarLayoutPorEsporte() {
  const esporte = window.__ESPORT_SELECTED;

  const blocoCompeticao = document.getElementById("bloco-competicao");
  const blocoConfronto = document.getElementById("bloco-confronto");
  const blocoMercado = document.getElementById("bloco-mercado");
  const blocoCartola = document.getElementById("bloco-cartola");

  if (!blocoCartola) return;

  if (esporte === "cartola") {
    console.log("🟢 MODO CARTOLA ATIVADO");

    // esconde apostação normal
    esconderElemento(blocoCompeticao);
    esconderElemento(blocoConfronto);
    esconderElemento(blocoMercado);

    // mostra bloco cartola
    blocoCartola.style.display = "block";
    mostrarElemento(blocoCartola);

    atualizarPosicaoCartola();

  } else {
    console.log("⚽ MODO ESPORTE NORMAL");

    // mostra tudo do esporte
    mostrarElemento(blocoCompeticao);
    mostrarElemento(blocoConfronto);
    mostrarElemento(blocoMercado);

    // esconde cartola
    blocoCartola.style.display = "none";
    esconderElemento(blocoCartola);
  }
}

// aguarda inputs existirem
function initCartolaListeners() {
  const tipo = document.getElementById("cartola-tipo");
  if (!tipo) return;

  tipo.addEventListener("change", atualizarPosicaoCartola);
}

setInterval(() => {
  aplicarLayoutPorEsporte();
  initCartolaListeners();
}, 300);
