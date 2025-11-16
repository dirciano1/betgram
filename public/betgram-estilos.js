(function () {

    console.log("🔍 Iniciando monitoramento… aguardando carregamento do bloco de análise.");

    // ==== CONFIGURAÇÕES ====
    const COR_HEADER = "#00B4D8";
    const COR_MERCADO = "#93c5fd";
    const COR_TERMO = "#38bdf8";
    const FONT_SIZE = "1.1em";

    const regexHeader = /(🏟️[^<]*)/g;
    const regexMercado = /\*\*(Mercado:[^\*]+)\*\*/g;
    const regexGeral = /\*\*([^\*]+)\*\*/g;

    // ==== FUNÇÃO PRINCIPAL ====
    function estilizar(div) {

        console.log("🎨 Aplicando estilização ao bloco:", div);

        let html = div.innerHTML;

        // Remove spans antigos
        html = html.replace(/<span\s+style="[^"]*">(.*?)<\/span>/gi, "$1");

        // Estilização do container
        div.style.fontFamily = "Inter, sans-serif";
        div.style.fontSize = FONT_SIZE;
        div.style.lineHeight = "1.6";

        // Headers 🏟️
        html = html.replace(regexHeader, t =>
            `<span style="color:${COR_HEADER};font-weight:800;font-size:1.2em">${t}</span>`
        );

        // Mercado:
        html = html.replace(regexMercado, (_, txt) =>
            `<span style="color:${COR_MERCADO};font-weight:700">${txt}</span>`
        );

        // Outros termos entre ** **
        html = html.replace(regexGeral, (_, txt) =>
            `<span style="color:${COR_TERMO};font-weight:600">${txt}</span>`
        );

        // Remove ** restantes
        html = html.replace(/\*\*/g, "");

        div.innerHTML = html;

        console.log("✅ Estilização concluída!");
    }

    // ==== OBSERVER ====
    const observer = new MutationObserver(() => {

        console.log("🔎 Procurando bloco de análise…");

        // Encontra QUALQUER bloco da análise
        const blocos = [...document.querySelectorAll("div")]
            .filter(div =>
                div.style.background.includes("11, 19, 36") &&
                div.style.border.includes("34, 197, 94") &&
                div.style.overflowY === "auto"
            );

        if (blocos.length > 0) {

            console.log(`🟢 ${blocos.length} bloco(s) encontrado(s)!`);
            
            blocos.forEach(estilizar);

            console.log("🛑 Finalizado. Observer desligado.");
            observer.disconnect();
        }

    });

    // Inicia o observer monitorando o body
    observer.observe(document.body, { childList: true, subtree: true });

})();
