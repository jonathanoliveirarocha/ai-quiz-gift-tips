# Diagnóstico do Mimo Certo

Atualizado em 17/11/2026, com base no site publicado em `mimocerto.vercel.app` e no código atual. 🟥 bloqueia a operação; 🟨 reduz a receita. Os números marcados como hipótese são estimativas sem dado real. As sugestões respeitam a decisão de manter o site enxuto.

## Os 5 pontos mais graves
1. 🟥 **O site está no ar sem dizer quem é o responsável.** A Política de Privacidade, os Termos e o Quem somos publicados mostram "[NOME OU RAZÃO SOCIAL]" e "[E-MAIL DE CONTATO]". Isso descumpre a LGPD, deixa a pessoa sem canal para pedir exclusão ou denunciar e dá ao site cara de teste.
2. 🟥 **A proteção de custo da IA tem furos.**
   - O anti-robô está desligado.
   - O teto diário libera chamadas quando o banco falha.
   - O teto conta chamadas, não reais.
   - Cota esgotada é tratada como erro passageiro.
   - O limite de "Quero outras ideias" nunca chega a valer.
3. 🟥 **A política afirma que a IA roda no plano pago do Google, mas nada garante isso.** No plano gratuito, o Google pode ler e usar o que é enviado, e a política vira informação falsa.
4. 🟥 **Parte dos cliques não paga comissão, e o painel diz que está tudo certo.** A receita real (vendas) não é medida em lugar nenhum.
5. 🟥 **Ninguém é avisado quando algo quebra.** Os alertas podem nem ser enviados, não há monitor externo, e as configurações que zeram a receita só aparecem se você abrir o painel.

## Marketing e marca
- **O posicionamento vende "IA", que todo mundo já tem de graça num chatbot.** A home só diz que "a IA analisa tudo". O que o resultado entrega de diferente fica escondido até o fim do quiz: o porquê de cada ideia, a mensagem pronta para o cartão, a dica de entrega e o "melhor evitar".
- **O compartilhamento não funciona no amigo secreto, a ocasião mais forte da temporada.** O link leva o nome digitado e abre todas as ideias, então mandá-lo ao grupo revela o sorteado e o presente. Para quem recebe, toda prévia é igual e genérica.
- **Nenhum canal traz visitas a tempo da Black Friday (27/11) e do Natal.** O site é novo, está num `.vercel.app` sem links de outros sites e ainda não foi verificado no Google Search Console.
- **A marca disputa atenção com o próprio slogan.** A frase principal destaca "presente certo", e `presentecerto.vercel.app` é de outro site, então quem lembra da frase em vez do nome pode cair no concorrente. "Mimo" também soa como lembrancinha, enquanto o quiz vai até "Acima de R$ 1.000". Sem domínio `.com.br`, a volta depende de lembrar um endereço que não é seu.

## SEO
- **Domínio emprestado e marca nova, sem autoridade.** Os 16 guias têm bom volume (cerca de 1.700 palavras cada), mas um subdomínio `.vercel.app` sem links externos demora a ranquear. O Search Console ainda não foi configurado.
- **Os guias foram escritos por IA, só com emojis e sem autor real.** O Google valoriza experiência e confiabilidade, e não há nenhuma foto nem revisão humana declarada.
- **Velocidade no celular pode melhorar.** O JavaScript principal tem 137 KB compactado, e a página carrega 3 famílias de fonte do Google, uma delas (Caveat) usada só num detalhe. A descrição da home tem 162 caracteres, um pouco acima do que o Google mostra.

## Produto e design
- **O plano B da IA é fraco.**
  - O acervo tem 38 ideias fixas, nenhuma infantil.
  - Ele acha ligação por pedaço de palavra: "cerveja artesanal" casa com "arte" e rende lápis aquareláveis.
  - Escreve "por que combina" mesmo quando não há ligação nenhuma.
  - Com o teto atingido ou a IA fora, todos os visitantes recebem isso.
- **O fim do quiz trava quem não conhece bem a pessoa.** "Do que essa pessoa gosta?" é obrigatória e não tem "não sei", embora o FAQ diga que dá para pular. Sem nome, as perguntas saem como "Qual a idade de essa pessoa?". "Ajustar respostas" recomeça da primeira pergunta.
- **No celular, a compra fica longe do dedo.** Ao trocar de pergunta, a página não volta ao topo. No resultado, os botões de compra aparecem depois do perfil, do emoji grande e dos textos, e o produto da Shopee, quando carrega, empurra os botões para baixo.
- **O produto da Shopee pode não ser o presente recomendado.** A escolha é o item mais vendido na faixa de preço, sem conferir se o nome bate. Nos guias, nem a faixa de preço é enviada.
- **Ainda há caminhos que terminam em erro, sem nenhum presente.** São eles: anti-robô que falha (manda recarregar e apaga as respostas), limite por IP atingido e link compartilhado que não abre (sem "Tentar de novo").
- **Acessibilidade e movimento.**
  - O foco do leitor de tela pula para a pergunta que está saindo.
  - Os erros não são anunciados, e o carregamento anuncia uma frase nova a cada 2,5 s.
  - A faixa de ocasiões em movimento na home é lida 20 vezes pelo leitor de tela, e também foge da home enxuta.

## Jurídico e compliance
- 🟥 **Controlador em branco** (ver ponto 1). Se o responsável for pessoa física, a guarda de IP por 6 meses citada como "obrigação legal" do Marco Civil também perde a base.
- 🟥 **Plano pago do Gemini e adendo de dados não confirmados.** Sem eles, a política é falsa e a transferência de dados para fora do Brasil fica sem base legal. O adendo LGPD do Google vale para serviços pagos; os da MongoDB, da Vercel e da Cloudflare ainda precisam ser confirmados.
- 🟨 **Os termos do Gemini proíbem sites que menores de 18 anos provavelmente acessem.** A única barreira é uma frase sob o último botão. O risco é o Google suspender a chave; confirmar com advogado se a autodeclaração basta.
- 🟨 **O filtro para menores não cobre tudo o que o site mostra.** Ele vale para as ideias da IA, mas não para o produto que a Shopee escolhe sozinha nem para as "Ofertas selecionadas". Os textos legais prometem esse filtro de forma geral.
- 🟨 **Os textos legais não batem com o código.**
  - O cartão e o "porquê" podem citar o "detalhe especial", que fica salvo 180 dias e visível para quem tem o link.
  - A API devolve relação, idade, interesses e orçamento, mas a política diz que quem recebe o link não vê as respostas.
  - Resultados antigos só são limpos depois que alguém rodar `npm run migrate:privacy`.
  - Um resultado denunciado só some depois de duas denúncias.
- 🟨 **Afiliados.** A "Estimativa R$ X a Y" aparece colada no botão da Amazon (confirmar com o suporte do programa). Na Shopee, o link atual é montado à mão, num formato não oficial.
- 🟨 **A marca "Mimo Certo" não tem busca nem pedido no INPI.** "Mimo" é sinônimo de presente, o que torna a marca fraca para registro.

## Financeiro
- **A margem por quiz é fina e não é medida.** Pela hipótese do financeiro, a IA consome de 30% a 40% da receita estimada de um quiz (R$ 0,11). O modelo principal custa cerca de 38% mais que o reserva. O site não grava os tokens gastos, então o painel mostra chamadas, nunca reais.
- **O teto não protege a conta do Google.** Com 2.000 chamadas por dia, o limite mensal do nível 1 (US$ 250) pode acabar em 15 a 22 dias (hipótese), e aí a API da conta inteira para até o dia 1º.
- **O site conhece cliques, não vendas.** Nenhuma comissão é importada, a Shopee não separa canais, e a Amazon só separa os canais cadastrados à mão. Não dá para saber se algum canal dá lucro.
- **A estrutura gratuita não serve para o negócio.** O plano Hobby da Vercel proíbe uso comercial, e o Atlas gratuito tem 512 MB. Com Vercel Pro e Atlas Flex, o custo fixo fica entre R$ 155 e 275 por mês, e o empate pede de 2.400 a 4.400 quizzes por mês (hipótese).
- **Ainda há trabalho manual todo mês.**
  - Nota fiscal para a Shopee (PJ) ou retenções (PF).
  - Conferência das comissões em dois painéis.
  - Exclusões pedidas por e-mail, feitas pela API (o painel não tem tela para isso).
  - Catálogo cadastrado por script, e qualquer mudança de teto ou de tag exige refazer o deploy.
  - Nada acompanha a regra da Amazon de 3 vendas em 180 dias (fonte não oficial).

## Tecnologia, segurança e dados
- 🟥 **Robôs ainda esgotam a IA.**
  - O anti-robô é opcional, está desligado, e libera a requisição quando a Cloudflare falha.
  - Algumas dezenas de IPs esgotam o teto de 2.000 chamadas em menos de uma hora, e a partir daí todo visitante real recebe o acervo até a meia-noite.
  - Sem anti-robô, a rota `/api/links` usa as suas credenciais da Shopee para termos quaisquer.
- 🟥 **O banco gratuito é ponto único de falha.** Cliques e eventos são gravados sem anti-robô e guardados por 13 meses, então qualquer um consegue encher os 512 MB. Quando o banco enche ou cai, somem os links de compartilhamento e as métricas, e o teto de IA para de valer. Não há backup.
- 🟥 **Alertas frágeis.** Os alertas são disparados sem esperar o envio e podem ser cortados quando a função serverless termina. Não há agendamento (cron) checando a saúde, e a queda do banco nunca gera alerta.
- 🟨 **O painel não é confiável.** Qualquer pessoa consegue enviar cliques e eventos falsos, e o "cliques por resultado" mistura os cliques dos guias.
- 🟨 **A IA ainda pode ser manipulada.**
  - A lista de "ideias já vistas" entra no prompt fora da área protegida.
  - A moderação só pega palavrões, e deixa passar link, telefone, Pix e difamação.
  - Uma requisição forjada com idade vazia desliga o filtro de menores.
- 🟨 **O painel de admin depende de um único token.** O token não tem requisito mínimo, e com ele dá para cadastrar oferta com qualquer link. Links antigos com ID previsível continuam aceitos até a limpeza dos dados antigos.
- 🟨 **Testes e verificação não protegem a operação.**
  - Os testes não cobrem rotas, limites, alertas nem a troca para o modelo reserva. Essa troca tem um furo: duas tentativas lentas do modelo principal gastam os 30 s, e o reserva nunca roda.
  - A verificação do GitHub não impede o deploy e não roda sozinha sem commit.
  - O build publica as páginas legais com colchetes, só com um aviso.

## Conclusão
O site está mais sólido do que no primeiro diagnóstico, mas ainda não está pronto para receber tráfego pago. A ordem segura:
1. Preencher os dados do responsável e confirmar o plano pago do Gemini, com limite de gasto no Google.
2. Fechar os furos de custo e de robôs: anti-robô obrigatório, teto que bloqueia quando o banco falha, cota esgotada sem nova tentativa e limite real de "outras ideias".
3. Garantir comissão em todo clique (API da Shopee com reserva de afiliado) e alertas confiáveis.
4. Corrigir o quiz e o acervo (gostos puláveis, textos sem "de essa pessoa", acervo honesto) e o compartilhamento no amigo secreto.
5. Crescer pelo orgânico (Search Console, guias de Natal e amigo secreto) e só investir em anúncio depois de medir quanto rende cada visita.

## Depende de você
- [ ] Preencher `frontend/src/content/legal/owner.ts` e publicar de novo (hoje as páginas legais estão no ar com colchetes).
- [ ] Ativar o faturamento do projeto do Gemini, definir um limite de gasto no AI Studio e aceitar o adendo de proteção de dados.
- [ ] Passar os projetos da Vercel para o plano Pro.
- [ ] Atlas com backup (plano Flex) e usuário do banco só com `readWrite`.
- [ ] Gerar as chaves da API da Shopee e do Cloudflare Turnstile, e criar as variáveis `ADMIN_TOKEN` e `ALERT_WEBHOOK_URL`.
- [ ] Rodar `npm run migrate:privacy` uma vez em produção.
- [ ] Verificar o site no Google Search Console e enviar o sitemap. Monitor gratuito (ex.: UptimeRobot) para `/api/health`.
- [ ] Buscar "Mimo Certo" no INPI e no registro.br (`mimocerto.com.br`).
- [ ] Advogado (LGPD, termos do Gemini, Amazon) e contador (CNPJ, notas da Shopee).

**Fontes principais:**
- [Preços da API Gemini](https://aistudio.google.com/docs/pricing)
- [Faturamento e limites do Gemini](https://aistudio.google.com/docs/billing)
- [Termos da API Gemini](https://aistudio.google.com/docs/terms)
- [Adendo LGPD do Google](https://business.safety.google/processorterms/lgpd/)
- [Políticas da Amazon Associados](https://associados.amazon.com.br/help/operating/policies)
- [Comissões da Amazon](https://associados.amazon.com.br/help/node/topic/GRXPHT8U84RAYDXZ)
- [Pagamentos da Shopee Afiliados](https://shopee.com.br/blog/afiliado-shopee-comissao-pagamentos/)
- [Plano Hobby da Vercel](https://vercel.com/docs/plans/hobby)
- [Limites do Atlas gratuito](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/)
- [ECA Digital](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/L15211.htm)
- [CONAR e links de afiliado](https://www.uai.com.br/networking-e-negocios/2026/09/23/ganha-comissao-com-link-de-afiliado-para-o-conar-isso-ja-e-publicidade/)
