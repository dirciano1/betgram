(function aplicarEstilizacaoCabecalhosVerdes() {

    // Seleciona TODOS os blocos de análise pelo estilo fixo conhecido
    const blocos = [...document.querySelectorAll("div")].filter(div =>
        div.style.background.includes("11, 19, 36") &&
        div.style.border.includes("34, 197, 94") &&
        div.style.overflowY === "auto"
    );

    if (blocos.length === 0) {
        console.error("❌ Não encontrei o bloco da análise.");
        return;
    }

    blocos.forEach(bloco => {

        // Encontra TODAS as linhas (usando <br>)
        let html = bloco.innerHTML;

        // REGEX: pega qualquer linha que COMEÇA com 🏟️ até o fim do trecho
        html = html.replace(/🏟️[^<]+/g, (match) => {
            return `<span style="
                color:#22c55e;
                font-weight:700;
                font-family:'Poppins','Inter','Nunito',sans-serif;
                font-size:1.18rem;
                letter-spacing:0.3px;
            ">${match}</span>`;
        });

        bloco.innerHTML = html;
    });

    console.log("🟢 Sucesso! Todas as linhas iniciadas com 🏟️ foram coloridas de verde.");
})();
