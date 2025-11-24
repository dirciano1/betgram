console.log("🔥 SCRIPT CARTOLA ATIVO!");

function iniciarCartola() {
  const esporte = window.__ESPORT_SELECTED;
  const blocoCompeticao = document.getElementById("bloco-competicao");
  const blocoConfronto = document.getElementById("bloco-confronto");
  const blocoMercado = document.getElementById("bloco-mercado");
  const inputAno = document.getElementById("bloco-ano");

  // Se ainda não existe, tenta novamente
  if (!blocoCompeticao || !blocoConfronto || !blocoMercado) {
    return false;
  }

  console.log("💚 ELEMENTOS ENCONTRADOS!");

  if (esporte === "cartola") {
    console.log("🟢 ATIVANDO MODO CARTOLA");

    blocoCompeticao.style.display = "none";
    blocoConfronto.style.display = "none";
    blocoMercado.style.display = "none";

    if (inputAno) inputAno.value = "2025";
  } else {
    console.log("⚪ VOLTANDO AO PADRÃO");

    blocoCompeticao.style.display = "";
    blocoConfronto.style.display = "";
    blocoMercado.style.display = "";
  }

  return true;
}

// Loop verificando se já pode aplicar mudanças
const intervalo = setInterval(() => {
  const ok = iniciarCartola();
  if (ok) clearInterval(intervalo);
}, 300);

// Observa mudanças no seletor de esporte
setInterval(() => {
  iniciarCartola();
}, 400);
