// public/betgram-estilos.js

(function () {
  function estilizarAnalises() {
    // Seleciona TODOS os blocos da análise pelo estilo fixo
    const blocos = [...document.querySelectorAll("div")].filter(
      (div) =>
        div.style.background.includes("11, 19, 36") &&
        div.style.border.includes("34, 197, 94") &&
        div.style.overflowY === "auto"
    );

    if (blocos.length === 0) return;

    blocos.forEach((bloco) => {
      // 1) Fonte moderna e um pouco maior para TODO o texto do bloco
      bloco.style.fontFamily = "'Poppins','Inter','Nunito',sans-serif";
      bloco.style.fontSize = "1.10rem";
      bloco.style.lineHeight = "1.60";
      bloco.style.letterSpacing = "0.2px";

      // 2) Trabalha em cima do HTML
      let html = bloco.innerHTML;

      // Remove spans antigos (valor, análise, etc) para não conflitar
      html = html.replace(/<span[^>]*>(.*?)<\/span>/g, "$1");

      // 3) Tudo que está entre **texto** → AZUL, maior
      html = html.replace(/\*\*([^\*]+)\*\*/g, (match, cap) => {
        return `
          <span style="
            color:#38bdf8;
            font-weight:700;
            font-family:'Poppins','Inter','Nunito',sans-serif;
            font-size:1.15rem;
            letter-spacing:0.3px;
          ">${cap}</span>`;
      });

      // 4) Qualquer trecho que COMEÇA com 🏟️ até o próximo <br> → VERDE
      html = html.replace(/🏟️[^<]+/g, (match) => {
        return `<span style="
            color:#22c55e;
            font-weight:700;
            font-family:'Poppins','Inter','Nunito',sans-serif;
            font-size:1.18rem;
            letter-spacing:0.3px;
        ">${match}</span>`;
      });

      // 5) Remove ** que sobra, se tiver
      html = html.replace(/\*\*/g, "");

      // 6) Atualiza o bloco
      bloco.innerHTML = html;
    });
  }

  // Roda quando a página carrega
  window.addEventListener("load", estilizarAnalises);

  // E roda de novo quando o DOM mudar (nova análise/histórico)
  const observer = new MutationObserver(estilizarAnalises);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
