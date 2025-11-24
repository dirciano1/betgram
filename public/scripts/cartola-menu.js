console.log("🔥 CARTOLA MODE SCRIPT LOADED");

// 🟢 Aguarda o React montar a tela
const waitForUI = setInterval(() => {
    const sport = window.__ESPORT_SELECTED;
    const blocoCartola = document.getElementById("bloco-cartola");

    if (blocoCartola) {
        clearInterval(waitForUI);
        console.log("✅ UI DETECTADA — CARTOLA MENU PRONTO");

        // ativa/deativa ao carregar
        aplicarModo(sport);

        // monitora mudanças no esporte
        setInterval(() => {
            aplicarModo(window.__ESPORT_SELECTED);
        }, 300);
    }

}, 200);


function aplicarModo(esporte) {
    const blocoCompeticao = document.getElementById("bloco-competicao");
    const blocoConfronto = document.getElementById("bloco-confronto");
    const blocoMercado = document.getElementById("bloco-mercado");
    const blocoCartola = document.getElementById("bloco-cartola");

    if (!blocoCompeticao || !blocoConfronto || !blocoMercado || !blocoCartola)
        return;

    if (esporte === "cartola") {
        console.log("🟢 MODO CARTOLA ATIVADO");

        blocoCompeticao.style.display = "none";
        blocoConfronto.style.display = "none";
        blocoMercado.style.display = "none";

        blocoCartola.style.display = "block";

    } else {
        console.log("🟡 MODO ESPORTE NORMAL");

        blocoCompeticao.style.display = "flex";
        blocoConfronto.style.display = "block";
        blocoMercado.style.display = "block";

        blocoCartola.style.display = "none";
    }
}
