// api-base.js
const BASE_URL = 'http://localhost:3000';

// Funções base para API
export const apiBase = {
    // [GET] Busca todos os valores
    async listar(endpoint) {
        try {
            const response = await fetch(`${BASE_URL}/${endpoint}`);
            if (!response.ok) {
                throw new Error(`Erro ao listar ${endpoint}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Erro ao listar ${endpoint}:`, error);
            throw error;
        }
    },

    // GET by id
    async buscarPorId(endpoint, id) {
        try {
            const response = await fetch(`${BASE_URL}/${endpoint}/${id}`);
            if (!response.ok) {
                throw new Error(`Erro ao buscar ${endpoint}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Erro ao buscar ${endpoint}:`, error);
            throw error;
        }
    },

    // POST
    async cadastrar(endpoint, dados) {
        try {
            const response = await fetch(`${BASE_URL}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!response.ok) {
                throw new Error(`Erro ao cadastrar ${endpoint}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Erro ao cadastrar ${endpoint}:`, error);
            throw error;
        }
    },

    // PUT
    async atualizar(endpoint, id, dados) {
        try {
            const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!response.ok) {
                throw new Error(`Erro ao atualizar ${endpoint}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Erro ao atualizar ${endpoint}:`, error);
            throw error;
        }
    },

    // DELETE
    async excluir(endpoint, id) {
        try {
            const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`Erro ao excluir ${endpoint}: ${response.statusText}`);
            }
            return true;
        } catch (error) {
            console.error(`Erro ao excluir ${endpoint}:`, error);
            throw error;
        }
    }
};

// Funções utilitárias
export const utils = {
    obterParametroUrl(parametro) {
        const url = new URL(window.location.href);
        return url.searchParams.get(parametro);
    },

    // funcao generica para buscar os dados do formulario idependente do tipo do formulario
    getFormData(form) {
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        return data;
    },

    mostrarMensagem(tipo, mensagem) {
        alert(`${tipo}: ${mensagem}`);
    }
};