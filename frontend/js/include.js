// Função para buscar o conteúdo HTML de uma parte específica
async function fetchHtml(part) {
    const response = await fetch(part);
    if (!response.ok) {
        throw new Error('Erro ao carregar o arquivo: ' + response.status);
    }
    return await response.text();
}

// Função para injetar o conteúdo HTML em um elemento-alvo
function injectHtml(target, html) {
    document.getElementById(target).innerHTML = html;
}

// Função principal que coordena a busca e injeção do HTML
async function loadHtml(part, target) {
    try {
        const data = await fetchHtml(part);
        injectHtml(target, data);
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Chamada da função para carregar o menu
loadHtml("/frontend/componentes/menu.html", "menu");