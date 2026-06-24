# 🏥 Controle de Almoxarifado

Sistema web desenvolvido para o gerenciamento de materiais de enfermagem em um almoxarifado hospitalar, permitindo cadastro, consulta, retirada e exclusão de itens com integração à MockAPI para persistência dos dados.

## 📌 Objetivo

O projeto foi desenvolvido para aplicar conceitos de Engenharia de Software, integração com APIs REST, manipulação do DOM, validações de regras de negócio e testes automatizados.

---

## ✨ Funcionalidades

| Sprint   | Funcionalidade                    | Método HTTP |
| -------- | --------------------------------- | ----------- |
| Sprint 1 | Cadastro de materiais             | POST        |
| Sprint 1 | Listagem de materiais             | GET         |
| Sprint 2 | Retirada de estoque com validação | PUT         |
| Sprint 2 | Exclusão de materiais             | DELETE      |
| Sprint 3 | Dashboard de acompanhamento       | Local       |
| Sprint 3 | Indicador de estoque crítico      | Local       |
| Sprint 3 | Pesquisa de materiais             | Local       |
| Sprint 3 | Tratamento de erros de conexão    | Local       |

---

## 🛠 Tecnologias Utilizadas

* HTML5
* CSS3
* JavaScript (ES6+)
* MockAPI
* Jest
* Jest Environment JSDOM
* Git e GitHub

---

## 📁 Estrutura do Projeto

```text
prova-2bi-ads-esoft-3sem-wesleybrene10/
│
├── index.html
├── style.css
├── main.js
├── package.json
├── README.md
│
├── .github/
├── .vscode/
│
└── __tests__/
    ├── sprint1.test.js
    ├── sprint2.test.js
    └── sprint3.test.js
```

---

## ⚙️ Funcionalidades Implementadas

### Cadastro de Materiais

Permite registrar novos materiais informando:

* Nome do material
* Quantidade disponível

Os dados são enviados para a MockAPI utilizando requisições POST.

---

### Listagem de Materiais

Ao carregar a página, os materiais cadastrados são obtidos da API através de requisições GET e exibidos em uma tabela.

---

### Retirada de Estoque

Permite realizar baixas no estoque através da função:

```javascript
validarRetirada(estoqueAtual, quantidadeRetirada)
```

Antes de efetuar a retirada, o sistema verifica se a operação é válida.

---

### Exclusão de Materiais

Os materiais podem ser removidos permanentemente através de requisições DELETE na MockAPI.

---

### Dashboard

O sistema apresenta informações resumidas sobre:

* Total de itens cadastrados
* Quantidade de materiais em estoque crítico

---

### Pesquisa de Materiais

Permite localizar rapidamente materiais cadastrados através de busca por nome.

---

### Tratamento de Erros

O sistema exibe mensagens de alerta quando ocorre falha de comunicação com o servidor.

---

## 📐 Contrato Técnico

| Elemento             | Identificador       |
| -------------------- | ------------------- |
| Nome do material     | `#input-nome`       |
| Quantidade           | `#input-quantidade` |
| Botão cadastrar      | `#btn-cadastrar`    |
| Lista de materiais   | `#lista-materiais`  |
| Campo de busca       | `#input-busca`      |
| Total de itens       | `#total-itens`      |
| Total críticos       | `#total-criticos`   |
| Botão baixar estoque | `.btn-baixar`       |
| Botão excluir        | `.btn-excluir`      |
| Campo de retirada    | `.input-retirada`   |

---

## 📋 Regras de Negócio

A função `validarRetirada()` impede que uma retirada seja realizada quando:

* A quantidade é menor ou igual a zero;
* A quantidade é negativa;
* A quantidade é maior que o estoque disponível;
* Os valores informados não são numéricos;
* Os valores são inválidos (NaN).

Exemplos:

```javascript
validarRetirada(10, 5);   // true
validarRetirada(5, 10);   // false
validarRetirada(10, -2);  // false
validarRetirada(10, 0);   // false
```

---

## 🧪 Testes Automatizados

Os testes automatizados foram desenvolvidos utilizando Jest.

### Executar todos os testes

```bash
npm install
npm run test:sprint1
npm run test:sprint2
npm run test:sprint3
```

### Cobertura dos testes

* Estrutura da interface
* Contratos obrigatórios
* Função de validação de retirada
* Regras de negócio
* Componentes do dashboard

---

## ▶️ Como Executar

1. Faça o download ou clone do projeto.
2. Abra a pasta do projeto.
3. Execute o arquivo `index.html` em um navegador moderno.

Não é necessário instalar servidor local para utilização da aplicação.

---

## 👨‍🎓 Autor

Projeto desenvolvido para fins acadêmicos na disciplina de Engenharia de Software.

**Aluno:** Wesley Brene
