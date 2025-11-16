// public/betgram-estilos.js

(function () {
  // ========= FUNÇÃO PRINCIPAL =========
  function estilizarAnalises() {
    // seleciona TODOS os blocos da análise pelo estilo padrão
    const blocos = [...document.querySelectorAll("div")].filter(
      (div) =>
        div.style.background.includes("11, 19, 36") &&
        div.style.border.includes("34, 197, 94") &&
        div.style.overflowY === "auto"
    );

    if (blocos.length === 0) return;

    blocos.forEach((bloco) => {
      // 1) Fonte moderna e texto um pouco maior pra tudo
      bloco.style.fontFamily = "'Poppins','Inter','Nunito',sans-serif";
      bloco.style.fontSize = "1.10rem";
      bloco.style.lineHeight = "1.60";
      bloco.style.letterSpacing = "0.2px";

      // 2) Pega o HTML bruto
      let html = bloco.innerHTML;

      // 3) Remove spans antigos
      html = html.replace(/<span[^>]*>(.*?)<\/span>/g, "$1");

      // 4) Estiliza tudo que estiver entre **texto** com AZUL e fonte 1.15
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

      // 5) Qualquer linha que COMEÇA com 🏟️ fica verde
      html = html.replace(/🏟️[^<]+/g, (match) => {
        return `<span style="
            color:#22c55e;
            font-weight:700;
            font-family:'Poppins','Inter','Nunito',sans-serif;
            font-size:1.18rem;
            letter-spacing:0.3px;
        ">${match}</span>`;
      });

      // 6) Limpa ** sobrando, se tiver
      html = html.replace(/\*\*/g, "");

      // 7) Atualiza o bloco
      bloco.innerHTML = html;
    });
  }

  // roda uma vez quando a página terminar de carregar
  window.addEventListener("load", estilizarAnalises);

  // e roda de novo sempre que o DOM mudar (nova análise renderizada)
  const observer = new MutationObserver(estilizarAnalises);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
