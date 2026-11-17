# Diagnóstico do Mimo Certo

O que impede o site de gerar receita sozinho, visto por cada setor de uma empresa. 🟥 bloqueia a operação; 🟨 reduz a receita. Os números marcados como hipótese são estimativas sem dado real.

## Situação em 17/11/2026
**Resolvido no código:**
- IA com modelo reserva e acervo próprio (a visita nunca termina em erro).
- Teto diário de custo e limite contra robôs que funciona na Vercel.
- O nome fora do servidor e da IA; textos livres não guardados; exclusão automática dos dados.
- Links com código aleatório e respostas ocultas para quem recebe o link.
- Filtros no código para menores, para o que a pessoa não quer e para ofensas.
- Frase da Amazon, aviso de afiliado, sem "% match" e preços marcados como estimativa.
- Política de privacidade, termos e "quem somos".
- Guias com botão de compra em cada ideia, e quiz que pula o que o guia já respondeu.
- Tags por canal, funil anônimo e painel em `/painel`.
- Alertas, testes e verificação automática no GitHub.

**Depende de você (não dá para fazer por código):**
- [ ] Preencher `frontend/src/content/legal/owner.ts` (nome, CPF/CNPJ, e-mail, cidade) antes de publicar.
- [ ] Ativar o faturamento do projeto da chave do Gemini (plano pago) e aceitar o adendo de proteção de dados do Google.
- [ ] Passar os dois projetos da Vercel para o plano Pro (uso comercial), com limite de gastos.
- [ ] No backend, criar as variáveis `ADMIN_TOKEN` e `ALERT_WEBHOOK_URL`. Detalhes em [AFILIADOS.md](AFILIADOS.md) e `backend/.env.example`.
- [ ] Gerar o App ID e a chave da API da Shopee (variáveis `SHOPEE_*`) e criar uma tag da Amazon por canal (`AMAZON_TRACKING_IDS`).
- [ ] Depois do deploy, rodar uma vez `npm run migrate:privacy` no backend com a `MONGODB_URI` de produção.
- [ ] Criar um monitor gratuito (ex.: UptimeRobot) para `https://SEU-BACKEND/api/health`.
- [ ] MongoDB Atlas: usuário do banco só com `readWrite` e plano com backup quando o painel avisar que o banco está perto do limite.
- [ ] Domínio próprio e Google Search Console (o código de verificação vai em `GOOGLE_SITE_VERIFICATION`).
- [ ] `CORS_ORIGIN` com o nome do seu time na Vercel (ex.: `https://meu-front-*-meutime.vercel.app`).
- [ ] Advogado: revisar privacidade e termos, transferência internacional e registro de acesso (Marco Civil). Busca da marca no INPI.
- [ ] Contador: CNPJ, regime tributário e notas fiscais da Shopee.
- [ ] Marketing:
  - Começar pelo orgânico (guias e compartilhamento) e acompanhar a receita por canal no painel antes de investir em anúncio.
  - Não comprar palavras-chave com "Amazon" nem anunciar o link da Shopee em busca paga.

## Os 5 pontos mais graves
1. 🟥 **A conta da Amazon pode ser encerrada.** O site descumpre regras do programa de associados: falta a frase obrigatória e ele coleta dados de crianças (detalhes em Jurídico).
2. 🟥 **Faltam privacidade e termos.** Há dados sensíveis expostos e nenhuma política de privacidade nem termos de uso.
3. 🟥 **Quando a IA falha, a visita é perdida sem receita.** Isso já aconteceu nos nossos testes.
4. 🟥 **Qualquer robô pode gerar custo de IA sem limite real.**
5. 🟨 **A receita por canal não é medida.** Sem ela, não dá para saber se o marketing pago se paga, e pela conta do financeiro hoje não se paga.

## Marketing e marca
- **O clique cai numa busca, não no presente.** O botão abre a busca da Amazon ou da Shopee, e a pessoa precisa escolher de novo entre dezenas de anúncios. O card mostra um emoji e um preço chutado pela IA, em vez de foto e preço real, e isso derruba a compra.
- **Os 16 guias de SEO não vendem.** As ideias dos guias são só texto, sem botão de loja, e algumas nem existem para comprar (biscoito caseiro, vídeo de recados). Quem chega do Google com vontade de comprar lê e vai embora.
- **Não há retenção.** O site não guarda contato, não lembra datas e não tem lista para quem presenteia várias pessoas. Cada visita futura precisa ser trazida de novo com anúncio ou com SEO.
- **O compartilhamento não viraliza.** Todo link de resultado tem a mesma prévia genérica. O texto de compartilhar revela o nome do presente, o que estraga a surpresa, e quem recebe o link não é convidado com clareza a fazer o próprio quiz. Também falta o loop natural de "faça o quiz sobre você e mande sua lista de desejos".
- **O posicionamento é genérico e a temporada está sendo perdida.** Nada explica por que usar o site em vez de um chatbot ou das listas das próprias lojas, e não há gancho de Black Friday nem de Natal. Comprar anúncio de busca também é limitado: a Amazon proíbe palavras-chave com "amazon", e a Shopee proíbe comprar palavras-chave para divulgar o link.

## SEO
- **O domínio é `.vercel.app`.** Um domínio emprestado tem menos autoridade, passa menos confiança no clique e prende a marca à Vercel.
- **O site é novo e não tem autoridade.** Sem links de outros sites apontando para ele, os guias publicados agora dificilmente ranqueiam a tempo do Natal. O SEO vai render no médio prazo, não nesta temporada.
- **Os sinais de confiança para o Google são fracos.** Os guias foram escritos por IA, não têm fotos nem autor, e o site não tem "quem somos". O Google valoriza experiência e confiabilidade.
- **Sem o Search Console, você não vê o que acontece.** Não dá para saber se as páginas foram indexadas, nem por quais buscas o site aparece ou deixa de aparecer.

## Produto e design
- **Não existe plano B quando a IA falha.** Com o provedor em alta demanda, a pessoa vê uma tela de erro e vai embora. Se a falha acontece em "Quero outras ideias", o erro apaga o resultado que já tinha botões de loja.
- **O quiz é longo.** São 11 telas, 7 delas obrigatórias, com até 30 interesses para escolher, numa promessa de "2 minutos". Quem vem de um guia já tem respostas preenchidas, mas começa da primeira pergunta mesmo assim. Em amigo secreto e presente para colega, a pessoa nem conhece bem quem vai ganhar.
- **A espera é longa e frágil.** Pode passar de 40 segundos, sem indicar quanto falta. Nada fica salvo no navegador, então quem recarrega a página perde as 11 respostas.
- **No celular, a compra fica escondida.** Os botões de loja são pequenos, dizem só "Amazon" ou "Shopee" e aparecem depois de um emoji gigante e de um anel de "match". O botão mais destacado da página é "Quero outras ideias", que gasta IA e não gera comissão.
- **O site promete o que não garante.** Ele diz "todas dentro do orçamento", mas o código não assegura isso. O "% match" é um número que a IA dá a si mesma, e vira 90 quando ela não informa. O preço estimado aparece sem a palavra "estimado". Quando a loja mostra outro preço, a confiança acaba.
- **A acessibilidade e as mensagens de erro passam amadorismo.** As opções selecionadas não são anunciadas para leitores de tela, e alguns campos não têm rótulo. Quando a rede falha, o visitante lê "Confira se o backend está rodando e o VITE_API_URL", uma mensagem de programador.

## Jurídico e compliance
- 🟥 **Amazon Associados.**
  - O contrato exige exatamente a frase "Como participante do Programa de Associados da Amazon, sou remunerado pelas compras qualificadas efetuadas"; o rodapé só diz que "alguns links podem ser de afiliados".
  - As políticas tratam como "site inapropriado" quem coleta dados de crianças menores de 13 anos, e o quiz pede a idade e os gostos de crianças.
  - Preço estimado ao lado do botão da Amazon e preço ou imagem fixos no catálogo também contrariam as regras.
  - Consequência: encerramento da conta e perda das comissões ainda não pagas.
- 🟥 **LGPD.**
  - O quiz sugere informar alergias, que são dado de saúde (sensível), e coleta dados de crianças e de um terceiro que não sabe de nada.
  - Tudo fica guardado para sempre, sem política de privacidade, sem base legal declarada e sem canal para a pessoa pedir exclusão.
  - Quem recebe o link do resultado consegue ver todas as respostas em "Ajustar respostas", e os IDs dos links são parcialmente previsíveis.
- 🟥 **Termos do Gemini.**
  - No plano gratuito, o Google pode ler e usar o que é enviado, e o site envia nomes, alergias e dados de crianças.
  - Mesmo no plano pago, os termos proíbem serviços que provavelmente serão usados por menores de 18 anos.
  - O envio de dados ao exterior também precisa de um mecanismo previsto na LGPD.
- 🟨 **O link da Shopee é montado à mão.** O formato não é oficial e pode não pagar comissão, ou ser tratado como link alterado, o que põe a conta em risco.
- 🟨 **Publicidade e defesa do consumidor.** O aviso de afiliado é fraco: diz "alguns links" quando todos são, e fica só no rodapé. O site não tem termos de uso. A recomendação da IA pode ignorar uma alergia ou sugerir algo impróprio para criança, e não há filtro no código, só a instrução no prompt.
- 🟨 **A marca é fraca juridicamente.** "Mimo Certo" é descritiva, difícil de registrar, e ninguém pesquisou se já existe no INPI. Trocar de nome depois faria perder o tráfego acumulado.

## Financeiro
- **Mídia paga não se paga hoje (hipótese).**
  - Cada quiz deixa cerca de R$ 0,10 de margem, já descontado o custo da IA.
  - Para empatar, o clique no anúncio teria de custar uns R$ 0,03, muito abaixo do mercado.
  - Como não há recompra nem cadastro, cada pessoa vale uma única visita.
- **O custo de IA não tem teto.** Um único robô no limite atual faria cerca de US$ 20 por dia em chamadas (hipótese), e "Quero outras ideias" não tem limite por resultado.
- **A receita é invisível e não tem alarme.** Uma tag da Amazon e um ID da Shopee valem para todo o tráfego, sem separação por canal, e nada concilia os cliques com as comissões. Se a tag sumir, a comissão zera em silêncio.
- **A estrutura gratuita não serve para o negócio.**
  - O plano gratuito da Vercel é proibido para uso comercial, e site de afiliados conta como comercial.
  - O banco gratuito tem 512 MB.
  - Com o Vercel Pro e um banco pago, o custo fixo fica entre US$ 28 e US$ 50 por mês, e o empate pede de 1.500 a 2.750 quizzes por mês (hipótese).
- **O dinheiro chega tarde e dá trabalho manual.** A Amazon paga cerca de 60 dias depois do mês da venda. A Shopee retém INSS e IR de pessoa física. Vai ser preciso CNPJ, nota fiscal, contador e capital de giro de 2 a 3 meses de anúncio.

## Tecnologia, segurança e operação
- 🟥 **Não há proteção contra abuso.**
  - O limite de requisições fica na memória de cada servidor e zera o tempo todo na Vercel.
  - Não há CAPTCHA.
  - As rotas de resultado e de cliques não têm limite nenhum, e o token de admin aceita tentativas infinitas.
- 🟥 **Ninguém fica sabendo quando o site cai.** O teste de saúde responde "ok" mesmo com a IA ou o banco fora do ar. Os erros só vão para um log que some rápido, e ninguém recebe alerta. Você pagaria anúncio para um site quebrado sem saber.
- 🟨 **O banco não tem limpeza nem backup.** Quando o espaço acabar, o quiz paga a IA e devolve erro. O catálogo cadastrado à mão pode se perder.
- 🟨 **Não há testes nem revisão antes de publicar.** Cada envio para a `main` vai direto ao ar, e nada confere se os links de afiliado continuam certos. Os sites de prévia usam o banco e a cota de produção.
- 🟨 **Alguém pode enganar a IA.** Com textos nos campos livres, dá para fazer a IA escrever algo ofensivo e espalhar o link do resultado com a marca do site.

## Dados
- **O funil não é medido.** O analytics só conta páginas, e o quiz inteiro roda numa só URL. Não dá para saber em qual pergunta as pessoas desistem, quantas veem erro ou quantas compartilham.
- **A origem das visitas não é registrada.** Sem saber de qual canal, guia ou campanha veio cada clique e cada comissão, a verba de marketing é gasta às cegas. Qualquer pessoa ainda consegue inflar a contagem de cliques.
- **O analytics gratuito tem limite.** O plano gratuito da Vercel pausa a coleta acima de 50 mil eventos por mês, justamente quando o tráfego crescer.

## Conclusão
Hoje o site funciona como demonstração, mas ainda não está pronto para rodar sozinho nem para receber verba de anúncio. A ordem segura é esta:
1. Resolver os 🟥 jurídicos: frase da Amazon, dados de crianças e de saúde, política de privacidade, plano pago da IA.
2. Criar um plano B para a IA, proteção contra robôs e alertas de queda.
3. Medir a receita por canal.
4. Levar o clique a produtos de verdade e pôr botões de loja nos guias.
5. Crescer primeiro por SEO e compartilhamento até provar quanto rende cada visita, e só então escalar anúncios.

Antes de investir pesado, valide os pontos legais com um advogado e os tributários com um contador.

**Fontes principais:** [Contrato da Amazon Associados](https://associados.amazon.com.br/help/operating/agreement) · [Políticas da Amazon Associados](https://associados.amazon.com.br/help/operating/policies) · [Comissões da Amazon](https://associados.amazon.com.br/help/node/topic/GRXPHT8U84RAYDXZ) · [Termos da API Gemini](https://aistudio.google.com/docs/terms) · [Preços da API Gemini](https://aistudio.google.com/docs/pricing) · [Uso justo da Vercel](https://vercel.com/docs/limits/fair-use-guidelines) · [Plano Hobby da Vercel](https://vercel.com/docs/plans/hobby) · [Limites do MongoDB Atlas gratuito](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/) · [Afiliados Shopee: comissões e pagamentos](https://shopee.com.br/blog/afiliado-shopee-comissao-pagamentos/) · [CONAR e links de afiliado](https://www.uai.com.br/networking-e-negocios/2026/09/23/ganha-comissao-com-link-de-afiliado-para-o-conar-isso-ja-e-publicidade/)
