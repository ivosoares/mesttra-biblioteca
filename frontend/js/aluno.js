//realiza o processamento do conteudo no frontend assim que a pagina for carregada
window.onload = processarCarregamentoPagina;

//verifica se tem alguma mensagem para exibir para o usuario
//e realiza o carregamento dos dados dos usuários a partir da API de consulta
function processarCarregamentoPagina() {
    carregarAlunos();
}

//realiza o carregamento dos dados do usuário no backend
async function carregarAlunos() {
    try {
        //faz a chamada na API
        const response = await fetch('http://localhost:3000/aluno');

        //se a chamada retornar algum erro
        if (!response.ok) {
            //determina o codigo da mensagem base no status do http
            const codigoStatus = determinarCodigoStatus(response);
            
            //determina a mensagem a ser exibida
            mensagem = retornarMensagem(codigoStatus);

            //exibe o modal com a mensagem
            abrirModalMensagem("Consultar Usuários", mensagem);

            //cancela a execução do restante da funcao
            return ;
        }

        //se chegou ate aqui a API executou com sucesso
        //converte os dados de JSON para objeto Java Script
        const usuarios = await response.json();
        
        //adiciona os dados dos usuários na div de listagem de usuarios
        adicionarUsuariosTabelaHtml(usuarios);
    } catch (error) {
        abrirModalMensagem("Consultar Usuários", 'Erro: ' + error.message);
    }
}

//realiza o cadastro do usuario, executando a API no backend 
async function realizarCadastro(evento) {
    evento.preventDefault();

    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const data_cadastro = document.getElementById('data_cadastro').value;
    const email = document.getElementById('email').value;
    const endereco = document.getElementById('endereco').value;
    const telefone = document.getElementById('telefone').value;

    const aluno = {
        nome,
        cpf,
        data_cadastro,
        email,
        endereco,
        telefone
    }

    try {
        //constroi o objeto contendo o conteudo a ser inserido na requisicao http
        const conteudoHttp = {
            method: 'POST',
            headers: { "Content-type": "application/json;" },
            body: JSON.stringify(aluno)
        }

        console.log(aluno);

        const httpResponse = await fetch('http://localhost:3000/aluno', conteudoHttp);
        
        if (!httpResponse.ok) {
            abrirModalMensagem("Cadastrar Usuário", `Erro: ${httpResponse.statusText}`);
        }
        
        alert('cadastrado com sucesso');

        
        carregarAlunos();
    } catch (error) {
        alert('Erro ao cadastrar: ' + error.message);
    }
}

//realiza a exclusão do usuário no backend
async function excluirUsuario(botao) {
    let mensagem;

    try {
        //obtem o id do usuario a ser excluido
        const id = botao.getAttribute('data-id');
        console.log(id);

        const conteudoHttp = {
            method: 'DELETE'
        }

        //realiza a chamada da API
        const response = await fetch(`http://localhost:3000/aluno/${id}`, conteudoHttp );

        //determina o codigo de status baseado no http response
        const codigoStatus = determinarCodigoStatus(response);
        console.log(response);

        //determina a mensagem a ser exibida para o usuario
        mensagem = retornarMensagem(codigoStatus);
        
    } catch (error) {
        mensagem = "Erro ao excluir usuário: " + error.message;
    }

    //fecha o modal excluir
    fecharModalExcluir();   

    //abre o modal de status para informar o resultado da exclusao, passando os parametros
    //do titulo do modal e a mensagem que será exibida
    abrirModalMensagem("Exclusão Usuário", mensagem);

    //atualiza os dados dos usuarios
    carregarAlunos();
}

function adicionarUsuariosTabelaHtml(usuarios){
    //obtem a div que contem os dados dos usuarios
    const divUsuarios = document.getElementById('dadosUsuarios');

    //limpa os dados da div para atualizar com os novos dados
    divUsuarios.innerHTML = '';

    //acessa cada elemento do vetor de usuarios e executa a funcao
    //adicionarLinhaTabelaHtml com o usuario obtido
    for (let i = 0; i < usuarios.length; i++) {
        //cria uma nova linha da tabela html
        const linhaTabela = document.createElement('tr');
        
        //monta o conteudo da linha
        linhaTabela.innerHTML = `
                <td>${usuarios[i].nome}</td>
                <td>${usuarios[i].cpf}</td>
                <td>${usuarios[i].email}</td>
                <td>${usuarios[i].telefone}</td>
                <td>${usuarios[i].endereco}</td>
                <td>${usuarios[i].data_cadastro}</td>
                <td></td>
                <td>
                  <a href="/frontend/cadastro/editar/aluno.html?id=${usuarios[i].id}"><button class="w3-button w3-green  w3-round">Editar</button></a>
                  <button class="w3-button w3-red  w3-round" onclick=abrirModalExcluir('${usuarios[i].id}')>Excluir</button>
                </td>`;

        //adiciona a nova linha na div de usuarios
        divUsuarios.appendChild(linhaTabela);       
    }  
}

//padroniza o codigo de status dentro da aplicacao frontend
function determinarCodigoStatus(response){
    if (!response.ok) 
        return statusOperacao.ENDPOINT_NAO_ENCONTRADO;
    else if (response.status == 204) 
        return statusOperacao.ID_NAO_ENCONTRADO; 
    else if (response.status == 200)
        return statusOperacao.SUCESSO;
    else  
        return statusOperacao.ERRO_GERAL;
}

//gera uma mensagem amigavel para o usuario baseado no codigo de status
function retornarMensagem(codigoStatus){
    let mensagem = "Status informado desconhecido.";

    switch (codigoStatus) {
        case statusOperacao.SUCESSO:
            mensagem = "Operação realizada com sucesso!";
            break;
        case statusOperacao.ID_NAO_INFORMADO: 
            mensagem = "Erro ao executar operação, ID não informado.";
            break;
        case statusOperacao.ERRO_GERAL: 
            mensagem = "Erro ao processar a operação.";
            break;
        case statusOperacao.ID_NAO_ENCONTRADO: 
            mensagem = "Erro ao executar operação, ID informado não encontrado.";
            break;
        case statusOperacao.ENDPOINT_NAO_ENCONTRADO: 
            mensagem = "Erro ao executar operação, Endpoint não encontrado.";
            break;
        default:
            break;
    }

    return mensagem;
}

//realiza a obtencao do parametro id caso seja passado na URL
function obterParametroId() {
    // Obtem o objeto que representa a URL que esta no browser
    const url = new URL(window.location.href);

    // Converte o objeto URL para URLSearchParams para acessar os parametros da URL
    const parametros = new URLSearchParams(url.search);

    // Obtem o valor do parâmetro 'id'
    return Number(parametros.get('id'));
}

//realiza a obtencao do parametro status caso seja passado na URL
function obterParametroStatus() {
    // Obtem o objeto que representa a URL que esta no browser
    const url = new URL(window.location.href);

    // Converte o objeto URL para URLSearchParams para acessar os parametros da URL
    const parametros = new URLSearchParams(url.search);

    // Obtem o valor do parâmetro 'status'
    return Number(parametros.get('status'));
}

//realiza a abertura do modal de confirmação de exclusão do usuario
function abrirModalExcluir(id) {
    const botaoConfirmarExcluir = document.getElementById('botaoConfirmarExcluir');
    botaoConfirmarExcluir.setAttribute('data-id', id);

    const modalExcluir = document.getElementById('modalExcluir');
    modalExcluir.style.display = 'block';
}

//realiza o fechamento do modal de confirmação de exclusão do usuario
function fecharModalExcluir() {
    const modalExcluir = document.getElementById('modalExcluir');
    modalExcluir.style.display = 'none';
}

function abrirModalMensagem(titulo, mensagem) {
    // Configura o html do titulo do modal
    document.getElementById('mensagemTitulo').innerHTML = titulo;
    // Configura o html da mensagem do modal
    document.getElementById('mensagemStatus').innerHTML = mensagem;
    // Altera o atributo css do modal para ser exibido
    document.getElementById('modalMensagem').style.display = 'block';
}

function fecharModalMensagem() {
    const modalExcluir = document.getElementById('modalMensagem');
    modalExcluir.style.display = 'none';
}