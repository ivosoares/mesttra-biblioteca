import { apiBase, utils } from "./api.js";

const ENDPOINT = 'autor'

export const autoresModule = {
    async carregarAutores() {
        try {
            const autores = await apiBase.listar(ENDPOINT);
            this.renderizarTabela(autores);
        } catch (error) {
            utils.mostrarMensagem('Erro', error.message);
        }
    },
    async cadastrarAutor(event) {
        event.preventDefault();
        try {
            const dados = utils.getFormData(event.target);
            await apiBase.cadastrar(ENDPOINT, dados);
            utils.mostrarMensagem('Sucesso', 'Autor Cadastrado com sucesso')
            event.target.reset();
        } catch (error) {
            utils.mostrarMensagem('Erro', error.message);
        }
    },
    renderizarTabela(autores) {
        const resultado = document.getElementById('dados');
        resultado.innerHTML = autores.map( autor => `
            <tr>
                <td>${autor.nome}</td>
                <td>
                    <a href="/frontend/cadastro/editar/autor.html?id=${autor.id}">
                        <button class="w3-button w3-green w3-round">Editar</button>
                    </a>
                </td>
                <td>
                    <button class="w3-button w3-red w3-round" 
                            onclick=this.excluirAutor('${autor.id}')>
                        Excluir
                    </button>
                </td>
            </tr>
        `)

    }
}

//incialização dos scripts

document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('dados')) {
        autoresModule.carregarAutores();
    }

    //Configuração do formulario
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (event) => {
            autoresModule.cadastrarAutor(event)
        })
    }

})
