const API_URL = "https://6a29ef4ff59cb8f65f1dd54b.mockapi.io/materiais";

const inputNome = document.getElementById("input-nome");
const inputQuantidade = document.getElementById("input-quantidade");
const btnCadastrar = document.getElementById("btn-cadastrar");
const listaMateriais = document.getElementById("lista-materiais");

async function listarMateriais() {
    try {
        const resposta = await fetch(API_URL);
        const materiais = await resposta.json();

        listaMateriais.innerHTML = "";

        materiais.forEach(material => {
            listaMateriais.innerHTML += `
                <tr>
                    <td>${material.nome}</td>
                    <td>${material.quantidade}</td>
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

listarMateriais();