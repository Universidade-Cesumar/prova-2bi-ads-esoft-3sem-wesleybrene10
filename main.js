const API_URL = "https://6a29ef4ff59cb8f65f1dd54b.mockapi.io/materiais";

// Referências DOM
const inputNome       = document.getElementById("input-nome");
const inputQuantidade = document.getElementById("input-quantidade");
const btnCadastrar    = document.getElementById("btn-cadastrar");
const listaMateriais  = document.getElementById("lista-materiais");
const inputBusca      = document.getElementById("input-busca");
const totalItensEl    = document.getElementById("total-itens");
const totalCriticosEl = document.getElementById("total-criticos");
const alertaErro      = document.getElementById("alerta-erro");
const msgVazia        = document.getElementById("msg-vazia");

/** Limite de estoque abaixo do qual um item é considerado crítico. */
const LIMITE_CRITICO = 10;

// Cache local dos materiais para filtrar sem novas requisições
let cacheMateriais = [];

// ─────────────────────────────────────────────
// VALIDAÇÃO
// ─────────────────────────────────────────────

/**
 * Valida se uma operação de retirada de estoque pode ser realizada.
 *
 * @param {number} estoqueAtual      - Quantidade disponível.
 * @param {number} quantidadeRetirada - Quantidade a retirar.
 * @returns {boolean} true se válido, false caso contrário.
 */
function validarRetirada(estoqueAtual, quantidadeRetirada) {
    if (typeof estoqueAtual !== "number" || typeof quantidadeRetirada !== "number") {
        return false;
    }
    if (Number.isNaN(estoqueAtual) || Number.isNaN(quantidadeRetirada)) {
        return false;
    }
    if (quantidadeRetirada <= 0) {
        return false;
    }
    if (quantidadeRetirada > estoqueAtual) {
        return false;
    }
    return true;
}

// ─────────────────────────────────────────────
// UTILITÁRIOS DE UI
// ─────────────────────────────────────────────

/** Exibe ou esconde o banner de erro de rede. */
function exibirErroRede(visivel) {
    alertaErro.hidden = !visivel;
}

/**
 * Atualiza o dashboard (total de itens e críticos)
 * e aplica/remove a classe .estoque-critico nas linhas da tabela.
 *
 * @param {Array} materiais - Lista completa de materiais (sem filtro).
 */
function atualizarDashboard(materiais) {
    const total    = materiais.length;
    const criticos = materiais.filter(m => m.quantidade < LIMITE_CRITICO).length;

    totalItensEl.textContent    = total;
    totalCriticosEl.textContent = criticos;
}

/**
 * Renderiza as linhas da tabela com base na lista recebida.
 * Aplica a classe .estoque-critico quando quantidade < LIMITE_CRITICO.
 *
 * @param {Array} materiais - Materiais a exibir (já filtrados, se houver busca).
 */
function renderizarLista(materiais) {
    listaMateriais.innerHTML = "";

    materiais.forEach(material => {
        const classeCritica = material.quantidade < LIMITE_CRITICO ? "estoque-critico" : "";

        listaMateriais.innerHTML += `
            <tr class="${classeCritica}" data-id="${material.id}">
                <td>${material.nome}</td>
                <td>${material.quantidade}</td>
                <td>
                    <input
                        type="number"
                        class="input-retirada"
                        id="input-retirada-${material.id}"
                        min="1"
                        placeholder="Qtd."
                    >
                </td>
                <td>
                    <button class="btn-baixar" data-id="${material.id}">
                        Baixar
                    </button>
                    <button class="btn-excluir" data-id="${material.id}">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });

    // Mensagem quando filtro não encontra resultados
    msgVazia.hidden = materiais.length > 0;
}

// ─────────────────────────────────────────────
// FILTRO DE PESQUISA
// ─────────────────────────────────────────────

/**
 * Filtra o cacheMateriais pelo texto digitado no #input-busca
 * e re-renderiza a lista sem fazer nova chamada à API.
 */
function filtrarMateriais() {
    const termo = inputBusca.value.trim().toLowerCase();
    const filtrados = cacheMateriais.filter(m =>
        m.nome.toLowerCase().includes(termo)
    );
    renderizarLista(filtrados);
}

inputBusca.addEventListener("input", filtrarMateriais);

// ─────────────────────────────────────────────
// CRUD — API
// ─────────────────────────────────────────────

/** Busca todos os materiais na API e atualiza cache, dashboard e tabela. */
async function listarMateriais() {
    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        cacheMateriais = await resposta.json();

        exibirErroRede(false);
        atualizarDashboard(cacheMateriais);
        filtrarMateriais(); // respeita o termo de busca atual ao recarregar

    } catch (erro) {
        console.error("Erro ao listar materiais:", erro);
        exibirErroRede(true);
    }
}

/** Cadastra um novo material via POST. */
btnCadastrar.addEventListener("click", async () => {
    const nome = inputNome.value.trim();
    const quantidade = Number(inputQuantidade.value);

    if (!nome) {
        alert("Informe o nome do material antes de cadastrar.");
        return;
    }
    if (isNaN(quantidade) || quantidade < 0) {
        alert("Informe uma quantidade válida (zero ou maior).");
        return;
    }

    const material = { nome, quantidade };

    try {
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(material)
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        inputNome.value      = "";
        inputQuantidade.value = "";
        exibirErroRede(false);
        listarMateriais();

    } catch (erro) {
        console.error("Erro ao cadastrar:", erro);
        exibirErroRede(true);
    }
});

/**
 * Realiza a baixa (retirada) de estoque via PUT,
 * após validar com validarRetirada().
 */
async function baixarEstoque(id, estoqueAtual) {
    const inputEl = document.getElementById(`input-retirada-${id}`);
    const quantidadeRetirada = Number(inputEl.value);

    if (!validarRetirada(estoqueAtual, quantidadeRetirada)) {
        alert(
            "Quantidade inválida. Verifique se o valor é maior que zero " +
            "e não excede o estoque atual (" + estoqueAtual + ")."
        );
        return;
    }

    const novaQuantidade = estoqueAtual - quantidadeRetirada;

    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantidade: novaQuantidade })
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        exibirErroRede(false);
        listarMateriais();

    } catch (erro) {
        console.error("Erro ao baixar estoque:", erro);
        exibirErroRede(true);
    }
}

/** Exclui um material via DELETE após confirmação do usuário. */
async function excluirMaterial(id) {
    const confirmar = confirm("Tem certeza que deseja excluir este material?");
    if (!confirmar) return;

    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        exibirErroRede(false);
        listarMateriais();

    } catch (erro) {
        console.error("Erro ao excluir material:", erro);
        exibirErroRede(true);
    }
}

// ─────────────────────────────────────────────
// DELEGAÇÃO DE EVENTOS — botões dinâmicos
// ─────────────────────────────────────────────

listaMateriais.addEventListener("click", (evento) => {
    const alvo = evento.target;

    if (alvo.classList.contains("btn-baixar")) {
        const id = alvo.dataset.id;
        const linha = alvo.closest("tr");
        const estoqueAtual = Number(linha.children[1].textContent);
        baixarEstoque(id, estoqueAtual);
    }

    if (alvo.classList.contains("btn-excluir")) {
        const id = alvo.dataset.id;
        excluirMaterial(id);
    }
});


listarMateriais();


if (typeof module !== "undefined" && module.exports) {
    module.exports = { validarRetirada };
}
