# Links de afiliado

Coloque os valores em `backend/.env` (local) e nas variáveis de ambiente do projeto **backend** na Vercel. Depois, faça um Redeploy. O site monta os links sozinho.

## Amazon → `AMAZON_ASSOCIATE_TAG`
1. Cadastre-se em https://associados.amazon.com.br
2. Copie sua tag de rastreamento (algo como `seunome-20`).
3. `AMAZON_ASSOCIATE_TAG=seunome-20`

## Shopee → `AFFILIATE_TEMPLATE_SHOPEE`
1. Cadastre-se e entre em https://affiliate.shopee.com.br
2. Em **Link personalizado**, gere um link para `https://shopee.com.br/search?keyword=presente`.
3. Abra o link gerado. Na barra de endereço aparece `utm_source=an_123456789`. Copie esse número.
4. `AFFILIATE_TEMPLATE_SHOPEE=https://shopee.com.br/search?keyword={query}&utm_source=an_123456789&utm_medium=affiliates`

> Montar o link assim não é um formato oficial da Shopee. Clique num link da Shopee no site e confira se o clique aparece no painel. Se não aparecer, ou se o painel recusar links de busca, use o catálogo (abaixo).

## Mercado Livre (desativado por enquanto)
Hoje cada sugestão só tem botões da Amazon e da Shopee. Para ativar o Mercado Livre:
- No backend: `ACTIVE_STORES=amazon,shopee,mercadolivre`.
- No frontend: adicione `'Mercado Livre'` em `frontend/src/content/stores.ts`.

O Mercado Livre não aceita link de afiliado em página de busca, então o botão leva para a busca sem comissão. Para ganhar comissão, use links de produto:
1. Cadastre-se em https://www.mercadolivre.com.br/l/comece-a-recomendar
2. Gere o link de cada produto em https://www.mercadolivre.com.br/l/afiliados-gerar-link
3. Cadastre os produtos no catálogo (veja abaixo).

## Catálogo (links de produto)
Funciona com qualquer loja. Os produtos aparecem em "Ofertas selecionadas" quando combinam com o resultado do quiz.
- Monte um JSON igual a `backend/data/catalogo-exemplo.json`, com `store` (`mercadolivre`, `shopee` ou `amazon`), `url` (seu link de afiliado), `tags` e `"active": true`.
- Importe com `cd backend` e `npm run import:catalog -- seu-arquivo.json`.
