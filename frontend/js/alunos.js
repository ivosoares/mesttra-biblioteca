// alunos.js
import { apiBase, utils } from './api.js';

const ENDPOINT = 'aluno';

export const alunosModule = {
    async carregarAlunos() {
        try {
            const alunos = await apiBase.listar(ENDPOINT);
            this.renderizarTabela(alunos);
        } catch (error) {
            utils.mostrarMensagem('Erro', error.message);
        }
    },

    async cadastrarAluno(event) {
        event.preventDefault();
        try {
            const dados = utils.getFormData(event.target);
            await apiBase.cadastrar(ENDPOINT, dados);
            utils.mostrarMensagem('Sucesso', 'Aluno cadastrado com sucesso!');
            event.target.reset();
            await this.carregarAlunos();
        } catch (error) {
            utils.mostrarMensagem('Erro', error.message);
        }
    },

    async carregarAluno() {
        const id = utils.obterParametroUrl('id');
        if (!id) return;

        try {
            const aluno = await apiBase.buscarPorId(ENDPOINT, id);
            this.preencherFormulario(aluno);
        } catch (error) {
            utils.mostrarMensagem('Erro', error.message);
        }
    },

    async atualizarAluno(event) {
        event.preventDefault();
        const id = document.getElementById('id').value;
        try {
            const dados = utils.getFormData(event.target);
            await apiBase.atualizar(ENDPOINT, id, dados);
            utils.mostrarMensagem('Sucesso', 'Aluno atualizado com sucesso!');
        } catch (error) {
            utils.mostrarMensagem('Erro', error.message);
        }
    },

    async excluirAluno(id) {
        if (!confirm('Deseja realmente excluir este aluno?')) return;
        
        try {
            await apiBase.excluir(ENDPOINT, id);
            utils.mostrarMensagem('Sucesso', 'Aluno excluído com sucesso!');
            await this.carregarAlunos();
        } catch (error) {
            utils.mostrarMensagem('Erro', error.message);
        }
    },

    renderizarTabela(alunos) {
        const tbody = document.getElementById('dadosUsuarios');
        tbody.innerHTML = alunos.map(aluno => `
            <tr>
                <td>${aluno.nome}</td>
                <td>${aluno.cpf}</td>
                <td>${aluno.email}</td>
                <td>${aluno.telefone}</td>
                <td>${aluno.endereco}</td>
                <td>${aluno.data_cadastro}</td>
                <td>
                    <a href="/frontend/cadastro/editar/aluno.html?id=${aluno.id}">
                        <button class="w3-button w3-green w3-round">Editar</button>
                    </a>
                    <button class="w3-button w3-red w3-round" 
                            onclick=this.excluirAluno('${aluno.id}')>
                        Excluir
                    </button>
                </td>
            </tr>
        `).join('');
    },

    preencherFormulario(aluno) {
        Object.keys(aluno).forEach(key => {
            const input = document.getElementById(key);
            if (input) input.value = aluno[key];
        });
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se está na página de listagem
    if (document.getElementById('dadosUsuarios')) {
        alunosModule.carregarAlunos();
    }

    // Verifica se está na página de edição
    if (utils.obterParametroUrl('id')) {
        alunosModule.carregarAluno();
    }

    // Configura o formulário
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            if (utils.obterParametroUrl('id')) {
                alunosModule.atualizarAluno(e);
            } else {
                alunosModule.cadastrarAluno(e);
            }
        });
    }
});