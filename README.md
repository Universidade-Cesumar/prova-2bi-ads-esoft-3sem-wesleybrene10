# 🏥 Controle de Almoxarifado

Sistema web para gerenciamento de materiais de enfermagem em um almoxarifado hospitalar, com integração à MockAPI para persistência dos dados.

## Funcionalidades

* Cadastro de materiais (POST)
* Listagem de materiais (GET)
* Retirada de estoque com validação (PUT)
* Exclusão de materiais (DELETE)

## Tecnologias Utilizadas

* HTML5
* CSS3
* JavaScript (ES6+)
* MockAPI
* Jest

## Estrutura do Projeto

```text
almoxarifado/
├── index.html
├── style.css
├── main.js
├── package.json
├── __tests__/
│   └── sprint3.test.js
└── README.md
```

## Execução

Abra o arquivo `index.html` em qualquer navegador moderno.

### Testes

```bash
npm install
npm run test:sprint1
npm run test:sprint2
npm run test:sprint3
```

## Regras de Validação

A retirada de materiais não é permitida quando:

* A quantidade é menor ou igual a zero;
* A quantidade é maior que o estoque disponível;
* O valor informado é inválido.

## Autor

Desenvolvido para fins acadêmicos na disciplina de Engenharia de Software.
