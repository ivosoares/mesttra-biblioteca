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
    async carregaAutor() {
        const id = utils.obterParametroUrl('id');
        try {
            const autor = await apiBase.buscarPorId(ENDPOINT, id);
            this.preencherFormulario(autor);
        } catch (error) {
            utils.mostrarMensagem('Erro', error.message);
        }
    },    
    async atualizarAutor(event) {
        event.preventDefault();
        const id = utils.obterParametroUrl('id');
        try {
            const dados = utils.getFormData(event.target);
            await apiBase.atualizar(ENDPOINT, id, dados);
            utils.mostrarMensagem('sucesso', 'Autor atualizado com sucesso')
        } catch (error) {
            utils.mostrarMensagem('Erro', error.message);
        }
    },
    async excluirAutor(id) {
        if(!confirm('Deseja realmente excluir o autor ?')) return;

        try {
            await apiBase.excluir(ENDPOINT,id);
            utils.mostrarMensagem('sucesso', 'Autor excluido com sucesso');
            await this.carregarAutores();
        } catch (error) {
            utils.mostrarMensagem('Erro', error.message);
        }

    },
    preencherFormulario(autor) {
        Object.keys(autor).forEach(key => {
            const input = document.getElementById(key)
            if(input) input.value = autor[key];
        })
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
                        id="btn_excluir"
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

    if(utils.obterParametroUrl('id')) {
        autoresModule.carregaAutor();
    }

    //Configuração do formulario
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (event) => {
            if(utils.obterParametroUrl('id')){
                autoresModule.atualizarAutor(event);
            }else {
                autoresModule.cadastrarAutor(event)
            }
        })
    }

    // const btn_excluir = document.getElementById('btn_excluir')
    // btn_excluir.addEventListener('onClik', () => {
    //     autoresModule.excluirAutor()
    // })

})
