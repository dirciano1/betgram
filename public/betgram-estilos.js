// public/betgram-estilos.js

(function () {

  let isRunning = false; // evita que o script rode em loop

  function estilizarAnalises() {
    if (isRunning) return; // impede loop infinito
    isRunning = true;

    // Seleciona TODOS os blocos da análise
    const blocos = [...document.querySelectorAll("div")].filter(
      (div) =>
        div.style.background.includes("11, 19, 36") &&
        div.style.border.includes("34, 197, 94") &&
        div.style.overflowY === "auto"
    );

    if (blocos.length === 0) {
      isRunning = false;
      return;
    }

    blocos.forEach((bloco) => {
      bloco.style.fontFamily = "'Poppins','Inter','Nunito',sans-serif";
      bloco.style.fontSize = "1.10rem";
      bloco.style.lineHeight = "1.60";

      let html = bloco.innerHTML;

      // remove spans pré-existentes
      html = html.replace(/<span[^>]*>(.*?)<\/span>/g, "$1");

      // aplica azul
      html = html.replace(/\*\*([^\*]+)\*\*/g, (match, cap) => {
        return `
          <span style="
            color:#38bdf8;
            font-weight:700;
            font-size:1.15rem;
            font-family:'Poppins','Inter','Nunito',sans-serif;
          ">${cap}</span>`;
      });

      // aplica verde nos títulos
      html = html.replace(/🏟️[^<]+/g, (match) => {
        return `
          <span style="
            color:#22c55e;
            font-weight:700;
            font-size:1.18rem;
            font-family:'Poppins','Inter','Nunito',sans-serif;
          ">${match}</span>`;
      });

      // remove sobra de **
      html = html.replace(/\*\*/g, "");

      bloco.innerHTML = html;
    });

    // libera novamente para rodar quando necessário
    isRunning = false;
  }

  // roda quando a página carrega
  window.addEventListener("load", estilizarAnalises);

  // roda quando o DOM muda, sem travar
  const observer = new MutationObserver(() => {
    if (!isRunning) estilizarAnalises();
  });

  observer.observe(document.body, { childList: true, subtree: true });

})();
