(function () {

    console.log("🔍 Monitoramento contínuo iniciado…");

    const COR_HEADER = "#00B4D8";
    const COR_MERCADO = "#93c5fd";
    const COR_TERMO = "#38bdf8";
    const FONT_SIZE = "1.02em";

    const regexHeader = /(🏟️[^<]*)/g;
    const regexMercado = /\*\*(Mercado:[^\*]+)\*\*/g;
    const regexGeral = /\*\*([^\*]+)\*\*/g;

    function estilizar(div) {

        // Evitar estilizar duas vezes
        if (div.dataset.estilizado === "1") {
            return;
        }

        console.log("🎨 Novo bloco detectado e estilizado:", div);

        let html = div.innerHTML;

        html = html.replace(/<span\s+style="[^"]*">(.*?)<\/span>/gi, "$1");

        div.style.fontFamily = "Inter, sans-serif";
        div.style.fontSize = FONT_SIZE;
        div.style.lineHeight = "1.6";

        html = html.replace(regexHeader, t =>
            `<span style="color:${COR_HEADER};font-weight:800;font-size:1.2em">${t}</span>`
        );

        html = html.replace(regexMercado, (_, txt) =>
            `<span style="color:${COR_MERCADO};font-weight:700">${txt}</span>`
        );

        html = html.replace(regexGeral, (_, txt) =>
            `<span style="color:${COR_TERMO};font-weight:600">${txt}</span>`
        );

        html = html.replace(/\*\*/g, "");

        div.innerHTML = html;

        // marca como estilizado
        div.dataset.estilizado = "1";
    }

    // Observer fica ativo SEMPRE
    const observer = new MutationObserver(() => {

        const blocos = [...document.querySelectorAll("div")]
            .filter(div =>
                div.style.background.includes("11, 19, 36") &&
                div.style.border.includes("34, 197, 94") &&
                div.style.overflowY === "auto"
            );

        blocos.forEach(estilizar);
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
