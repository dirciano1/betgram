// Script para estilizar o bloco de Análise dentro de um item de Histórico.
// A busca é feita pelo emoji 🏟️, garantindo que funcione para qualquer partida.
// Copie e cole no console do navegador.

function aplicarEstilizacaoFinalPorEmoji() {
    
    // --- Configurações de Cores e Estilo ---
    // Cor para as linhas que começam com o emoji 🏟️
    const COR_HEADER_PARTIDA = '#00B4D8';
    // Cor para os cabeçalhos de Mercado (**Mercado: ...**)
    const COR_MERCADO_INDIGO = '#93c5fd'; 
    // Cor para os termos-chave restantes (**Odd Justa**, **Probabilidade**, etc.)
    const COR_PRINCIPAL_AZUL = '#38bdf8';    
    const FONT_SIZE = '1.1em'; // Tamanho de fonte aumentado
    
    // --- Expressões Regulares ---
    const regexHeader = /(🏟️[^<]*)/g; 
    const regexMercado = /\*\*(Mercado:[^\*]+)\*\*/g;
    const regexGeral = /\*\*([^\*]+)\*\*/g; 
    
    // String de busca ÚNICA E CONSTANTE para encontrar o container: o emoji do estádio.
    const chaveDeBusca = '🏟️';

    // 1. Procura o elemento DIV de CONTEÚDO
    const todosOsDivs = document.querySelectorAll('div');
    let elementoEncontrado = null;

    // Itera por todos os divs
    for (const div of todosOsDivs) {
        // Verifica se o div contém o emoji E se ele tem um conteúdo longo (> 200 caracteres)
        // para garantir que estamos no bloco da análise e não em um ícone isolado.
        if (div.textContent && div.textContent.includes(chaveDeBusca) && div.textContent.length > 200) {
            // Este deve ser o div interno que contém a análise completa.
            elementoEncontrado = div;
            break;
        }
    }

    if (elementoEncontrado) {
        let htmlContent = elementoEncontrado.innerHTML;

        // --- Etapa 1: Limpeza de Estilos Antigos ---
        // Remove quaisquer tags <span> com estilos inline existentes.
        htmlContent = htmlContent.replace(/<span\s+style="[^"]*">(.*?)<\/span>/gi, '$1');

        // --- Etapa 2: Estilização do Container de Conteúdo ---
        const containerStyle = elementoEncontrado.style;
        containerStyle.fontFamily = 'Inter, sans-serif';
        containerStyle.fontSize = FONT_SIZE; 
        containerStyle.lineHeight = '1.6';
        containerStyle.borderRadius = '12px'; 
        
        // ------------------ Aplicando as Regras de Cores (Ordem Importa!) ------------------

        // --- Etapa 3: Estilo dos Headers de Partida (🏟️) - AZUL MARINHO BRILHANTE ---
        // Deve ser a primeira regra de cor.
        htmlContent = htmlContent.replace(regexHeader, (match, capturedText) => {
            return `<span style="color: ${COR_HEADER_PARTIDA}; font-weight: 800; font-size: 1.2em;">${capturedText}</span>`;
        });
        
        // --- Etapa 4: Estilo dos Headers de Mercado (**Mercado: ...**) - ÍNDIGO/AZUL ESCURO ---
        htmlContent = htmlContent.replace(regexMercado, (match, capturedText) => {
            return `<span style="color: ${COR_MERCADO_INDIGO}; font-weight: 700;">${capturedText}</span>`;
        });

        // --- Etapa 5: Estilo dos Termos Chave (**Odd Justa**, **Probabilidade**, etc.) - AZUL PRINCIPAL ---
        htmlContent = htmlContent.replace(regexGeral, (match, capturedText) => {
             return `<span style="color: ${COR_PRINCIPAL_AZUL}; font-weight: 600;">${capturedText}</span>`;
        });
        
        // --- Etapa 6: Limpeza Final ---
        htmlContent = htmlContent.replace(/\*\*/g, '').trim();

        // 7. Atualiza o conteúdo HTML do elemento na página
        elementoEncontrado.innerHTML = htmlContent;

        console.log("Sucesso! Estilização completa aplicada usando o emoji 🏟️ como âncora.");

    } else {
        console.error("Erro: Não foi possível encontrar o bloco de análise. Certifique-se de que o texto está visível e contém o emoji 🏟️.");
    }
}

// Executa a função
aplicarEstilizacaoFinalPorEmoji();
