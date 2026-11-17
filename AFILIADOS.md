# Links de afiliado

Coloque os valores em `backend/.env` (local) e nas variáveis de ambiente do projeto **backend** na Vercel. Depois, faça um Redeploy. O site monta os links sozinho. O painel (`/painel` no site) avisa se faltar alguma configuração.

## Amazon → `AMAZON_ASSOCIATE_TAG`
1. Cadastre-se em https://associados.amazon.com.br
2. Copie sua tag de rastreamento (algo como `seunome-20`).
3. `AMAZON_ASSOCIATE_TAG=seunome-20`

**Saber de onde vem cada venda:** no painel da Amazon, crie uma tag para cada canal (ex.: `seunome-ig-20` para o Instagram) e preencha `AMAZON_TRACKING_IDS=instagram=seunome-ig-20,tiktok=seunome-tt-20`. Nas divulgações, use links com `?utm_source=instagram` (ou `tiktok`, `whatsapp`...).

## Shopee → API oficial (recomendado)
1. Cadastre-se e entre em https://affiliate.shopee.com.br
2. No painel, abra a área **Open API** e gere o App ID e a chave secreta.
3. `SHOPEE_APP_ID=...` e `SHOPEE_APP_SECRET=...`

Com a API, cada ideia mostra um produto real da Shopee (foto e preço) com o link oficial de afiliado. Se a API falhar, o site volta sozinho para o link de busca.

**Sem a API** (formato não oficial; confira no painel se os cliques aparecem):
`AFFILIATE_TEMPLATE_SHOPEE=https://shopee.com.br/search?keyword={query}&utm_source=an_SEUID&utm_medium=affiliates&utm_content={canal}`
O `SEUID` aparece em `utm_source=an_...` quando você abre um link gerado em **Link personalizado**.

## Mercado Livre (desativado por enquanto)
Para ativar: `ACTIVE_STORES=amazon,shopee,mercadolivre` no backend e `'Mercado Livre'` em `frontend/src/content/stores.ts`.
O Mercado Livre não aceita link de afiliado em página de busca; para ganhar comissão, gere links de produto em https://www.mercadolivre.com.br/l/afiliados-gerar-link e cadastre no catálogo (abaixo).

## Catálogo (links de produto)
Produtos de qualquer loja aparecem em "Ofertas selecionadas" quando combinam com o resultado.
- Monte um JSON igual a `backend/data/catalogo-exemplo.json`, com `store`, `url` (seu link de afiliado), `tags` e `"active": true`.
- Importe com `cd backend` e `npm run import:catalog -- seu-arquivo.json`.
- Produtos da Amazon entram sem preço e sem imagem (regra do programa da Amazon).
