
# Simulador de Loja

![alt text](/public/image.png)

Este projeto é um simulador de loja que permite aos usuários filtrar produtos com base no seu CEP e adicionar produtos a um carrinho.

## Pré-requisitos
- Node.js caso queira rodar o projeto localmente ou Docker caso queira rodar o projeto em um container.

## Funcionalidades
- Buscar produtos de uma API.
- Filtrar produtos por CEP (apenas produtos disponíveis no estado do usuário são exibidos).
- Filtrar produtos por nome.
- Adicionar/remover produtos ao carrinho.

## Como Funciona
1. Insira um CEP válido no campo de entrada e clique em "Buscar Produtos".
2. O aplicativo busca os produtos da API e os filtra com base no estado do usuário.
3. Use a barra de pesquisa para filtrar produtos por nome.
4. Clique em "Adicionar ao carrinho" para adicionar um produto ao carrinho.
5. Use os botões "+" e "-" no carrinho para ajustar a quantidade de itens.

## Tecnologias
- HTML, CSS, JavaScript
- Bootstrap para estilização
- Fetch API para fazer requisições HTTP

## Configuração
1. Clone o repositório.
2. Utilize a chave da API fornecida no teste para configurar o .env
(O arquivo deve estar na mesma pasta e com o mesmo formato que o .env.example)
3. SEM DOCKER:
    3. Execute o servidor backend com `npm run start` (certifique-se de que ele está rodando em `http://localhost:3000`).
    4. Abra `/frontend/index.html` no seu navegador.
3. COM DOCKER:
    3. Execute 'docker compose up'.
    4. Abra `http://localhost:8080/loja.html` no navegador.

## Endpoints da API
- `GET /api/products`: Busca todos os produtos.
- `GET /api/cep/{cep}`: Busca detalhes do endereço para um CEP específico.

## Melhorias
- Armazenar em cache os detalhes do CEP para reduzir chamadas à API.
- Adicionar um botão "Limpar Carrinho".
- Melhorar o tratamento de erros e o feedback ao usuário.