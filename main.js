const API_URL = "https://6a29ef4ff59cb8f65f1dd54b.mockapi.io/materiais";

const inputNome = document.getElementById("input-nome");
const inputQuantidade = document.getElementById("input-quantidade");
const btnCadastrar = document.getElementById("btn-cadastrar");
const listaMateriais = document.getElementById("lista-materiais");

/**
 * Valida se uma operação de retirada de estoque pode ser realizada.
 *
 * Regras de negócio:
 * - A quantidade a retirar não pode ser negativa.
 * - A quantidade a retirar não pode ser zero.
 * - A quantidade a retirar não pode ser maior que o estoque atual.
 *
 * @param {number} estoqueAtual - Quantidade atualmente disponível em estoque.
 * @param {number} quantidadeRetirada - Quantidade que se deseja retirar.
 * @returns {boolean} true se a operação é válida, false caso contrário.
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

async function listarMateriais() {
    try {
        const resposta = await fetch(API_URL);
        const materiais = await resposta.json();

        listaMateriais.innerHTML = "";

        materiais.forEach(material => {
            listaMateriais.innerHTML += `
                <tr data-id="${material.id}">
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

    } catch (erro) {
        console.error("Erro ao listar materiais:", erro);
    }
}

btnCadastrar.addEventListener("click", async () => {

    const material = {
        nome: inputNome.value,
        quantidade: Number(inputQuantidade.value)
    };

    try {
        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(material)
        });

        inputNome.value = "";
        inputQuantidade.value = "";

        listarMateriais();

    } catch (erro) {
        console.error("Erro ao cadastrar:", erro);
    }
});

/**
 * Realiza a baixa (retirada) de estoque de um material via PUT,
 * após validar a operação com validarRetirada().
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
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ quantidade: novaQuantidade })
        });

        listarMateriais();

    } catch (erro) {
        console.error("Erro ao baixar estoque:", erro);
    }
}

/**
 * Exclui um material do MockAPI via DELETE e atualiza a tela.
 */
async function excluirMaterial(id) {
    const confirmar = confirm("Tem certeza que deseja excluir este material?");
    if (!confirmar) return;

    try {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        listarMateriais();

    } catch (erro) {
        console.error("Erro ao excluir material:", erro);
    }
}

// Delegação de eventos: captura cliques nos botões dinâmicos
// (.btn-baixar e .btn-excluir) criados após a renderização da lista.
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

// Export condicional: permite que validarRetirada seja importada pelos
// testes Jest (ambiente Node) sem afetar a execução no navegador.
if (typeof module !== "undefined" && module.exports) {
    module.exports = { validarRetirada };
}
