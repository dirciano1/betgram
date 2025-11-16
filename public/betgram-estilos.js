// Script para ser copiado e colado no console do navegador.
// Aplica estilos modernos e cores hierárquicas (Headers > Mercado > Termos Chave).

function aplicarEstilizacaoFinal() {
    
    // --- Configurações de Cores e Estilo ---
    // Cor para as linhas que começam com o emoji 🏟️
    const COR_HEADER_PARTIDA = '#00B4D8';
    // Cor para os cabeçalhos de Mercado (**Mercado: ...**)
    const COR_MERCADO_INDIGO = '#93c5fd'; 
    // Cor para os termos-chave restantes (**Odd Justa**, **Probabilidade**, etc.)
    const COR_PRINCIPAL_AZUL = '#38bdf8';    
    const FONT_SIZE = '1.1em';

    // --- Expressões Regulares ---
    const regexHeader = /(🏟️[^<]*)/g; // Captura 🏟️ seguido por qualquer coisa até uma tag de HTML (como <br>)
    const regexMercado = /\*\*(Mercado:[^\*]+)\*\*/g; // Captura **Mercado: ...**
    const regexGeral = /\*\*([^\*]+)\*\*/g; // Captura o restante dos **termos**
    
    // String de busca para encontrar o container correto na página
    const chaveDeBusca = 'ALBANIA x INGLATERRA';

    // 1. Procura o elemento DIV na página
    const todosOsDivs = document.querySelectorAll('div');
    let elementoEncontrado = null;

    for (const div of todosOsDivs) {
        if (div.textContent && div.textContent.includes(chaveDeBusca) && div.textContent.length > 100) {
            elementoEncontrado = div;
            break;
        }
    }

    if (elementoEncontrado) {
        let htmlContent = elementoEncontrado.innerHTML;

        // --- Etapa 1: Limpeza de Estilos Antigos ---
        // Remove quaisquer tags <span> com estilos inline que já existam, MANTENDO o conteúdo interno ($1).
        // Isso remove as cores antigas e permite que as novas sejam aplicadas corretamente.
        htmlContent = htmlContent.replace(/<span\s+style="[^"]*">(.*?)<\/span>/gi, '$1');

        // --- Etapa 2: Estilização do Container ---
        const containerStyle = elementoEncontrado.style;
        containerStyle.fontFamily = 'Inter, sans-serif';
        containerStyle.fontSize = FONT_SIZE;
        containerStyle.lineHeight = '1.6';
        containerStyle.borderRadius = '12px'; 
        containerStyle.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';

        // --- Etapa 3: Estilo dos Headers de Partida (🏟️) - AZUL MARINHO ---
        // Aplica o estilo na linha de confronto. Deve ser a primeira regra de cores.
        htmlContent = htmlContent.replace(regexHeader, (match, capturedText) => {
            return `<span style="color: ${COR_HEADER_PARTIDA}; font-weight: 800; font-size: 1.2em;">${capturedText}</span>`;
        });
        
        // --- Etapa 4: Estilo dos Headers de Mercado (**Mercado: ...**) - ÍNDIGO/AZUL ESCURO ---
        // Aplica o estilo na linha de mercado, respeitando a hierarquia.
        htmlContent = htmlContent.replace(regexMercado, (match, capturedText) => {
            return `<span style="color: ${COR_MERCADO_INDIGO}; font-weight: 700;">${capturedText}</span>`;
        });

        // --- Etapa 5: Estilo dos Termos Chave (**Probabilidade**, **Odd Justa**, etc.) - AZUL PRINCIPAL ---
        // Aplica o estilo nos demais termos entre ** **.
        htmlContent = htmlContent.replace(regexGeral, (match, capturedText) => {
             return `<span style="color: ${COR_PRINCIPAL_AZUL}; font-weight: 600;">${capturedText}</span>`;
        });
        
        // --- Etapa 6: Limpeza Final ---
        htmlContent = htmlContent.replace(/\*\*/g, '').trim();

        // 7. Atualiza o conteúdo HTML do elemento na página
        elementoEncontrado.innerHTML = htmlContent;

        console.log("Sucesso! Estilização completa e moderna aplicada. Headers de Partida estão em azul claro destacado.");

    } else {
        console.error("Erro: Não foi possível encontrar o elemento DIV contendo o texto de análise. Certifique-se de que o texto está visível na tela.");
    }
}

// Executa a função
aplicarEstilizacaoFinal();
