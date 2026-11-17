import type { LegalPage } from './types.ts'
import { OWNER } from './owner.ts'

const page: LegalPage = {
  slug: 'termos-de-uso',
  title: 'Termos de Uso | Presente Certo',
  description:
    'Regras de uso do Presente Certo: quem pode usar o quiz, limites das sugestões da IA, preços estimados, links de afiliado e seus direitos como consumidor.',
  h1: 'Termos de Uso',
  updated: '2026-11-17',
  intro:
    'Estes termos explicam as regras para usar o Presente Certo. Ao usar o site e tocar no botão final do quiz, você concorda com eles e com a Política de Privacidade. Se não concordar, não use o serviço.',
  sections: [
    {
      heading: 'Quem oferece o serviço',
      paragraphs: [
        `O Presente Certo é mantido por ${OWNER.name} (${OWNER.document}), de ${OWNER.city}. Contato: ${OWNER.email}.`,
      ],
    },
    {
      heading: 'O que é o Presente Certo',
      paragraphs: [
        'É um site gratuito que sugere presentes com inteligência artificial. Você responde 11 perguntas sobre quem vai ganhar, e o site mostra um presente principal, outras ideias e botões para procurar cada sugestão em lojas parceiras. Também publicamos guias de presentes por pessoa e ocasião.',
        'Não há cadastro, login nem pagamento. O Presente Certo não vende produtos: a compra acontece na loja.',
      ],
    },
    {
      heading: 'Quem pode usar',
      paragraphs: [
        'O serviço é destinado a maiores de 18 anos. Ao tocar no botão final do quiz, você confirma ter 18 anos ou mais. O presente pode ser para alguém de qualquer idade, inclusive criança, mas quem usa o site precisa ser adulto.',
      ],
    },
    {
      heading: 'Uso aceitável',
      paragraphs: [
        'Se você descumprir estas regras, podemos bloquear o seu acesso e remover o conteúdo relacionado. Ao usar o site, você se compromete a não:',
      ],
      items: [
        'escrever, nos campos de texto livre, dados que identifiquem alguém, como nome completo, documentos, endereço ou telefone;',
        'informar dados sensíveis, como de saúde, religião ou vida sexual, seus ou de outra pessoa;',
        'inserir conteúdo ofensivo, discriminatório ou ilegal, ou tentar fazer a IA produzir esse tipo de conteúdo;',
        'usar robôs, scripts ou outra automação para enviar quizzes, gerar cliques ou copiar conteúdo em massa;',
        'tentar burlar os limites de uso, a verificação anti-robô ou a segurança do site.',
      ],
    },
    {
      heading: 'Sugestões feitas por inteligência artificial',
      paragraphs: [
        'As sugestões são geradas automaticamente pela API Gemini, do Google, a partir das suas respostas. Quando a IA está indisponível, elas podem vir de um banco interno de ideias, e o site avisa. São ideias para inspirar a sua escolha, não aconselhamento profissional; a decisão de compra é sua.',
        'A IA pode errar: pode sugerir algo fora do orçamento, que a pessoa já tem ou não gosta, ou descrever um produto de forma imprecisa. O site filtra automaticamente bebidas alcoólicas e itens impróprios quando o presente é para menor de idade e tenta respeitar o que a pessoa não gosta, mas não garante. Antes de comprar, confira na loja o preço, o frete, a composição, os alergênicos, a indicação de idade e o selo do Inmetro, quando exigido.',
      ],
    },
    {
      heading: 'Preços estimados',
      paragraphs: [
        'Os preços nas sugestões da IA são estimativas, não preços das lojas. Quando houver produto da Shopee com foto e preço, esses dados vêm da própria Shopee e podem mudar a qualquer momento. Valem sempre o preço, o frete, o prazo e as condições da loja no momento da compra.',
      ],
    },
    {
      heading: 'Links de afiliado e Ofertas selecionadas',
      paragraphs: [
        'Os botões de loja levam à Amazon e à Shopee com links de afiliado. Se você comprar por eles, podemos receber uma comissão da loja, sem nenhum custo extra para você. É isso que mantém o site gratuito.',
        'Como participante do Programa de Associados da Amazon, sou remunerado pelas compras qualificadas efetuadas.',
        'As "Ofertas selecionadas" são produtos de parceiros com link de afiliado, escolhidos pela combinação de temas com o seu resultado. Ninguém paga por posição.',
      ],
    },
    {
      heading: 'Sites de terceiros',
      paragraphs: [
        'Ao clicar em um botão de loja, você sai do Presente Certo. A venda, o pagamento, a entrega, a troca e a garantia ficam a cargo da loja, que tem termos, política de privacidade e cookies próprios. Não controlamos o conteúdo nem as ofertas dessas lojas.',
      ],
    },
    {
      heading: 'Resultados compartilhados e denúncias',
      paragraphs: [
        'Cada resultado tem um link próprio. Quem tiver o link vê as ideias e os textos do resultado, mas não as respostas do quiz; se você compartilhar, o nome ou apelido também vai no link. Compartilhe só com quem quiser.',
        `Você é responsável pelo que escreve no quiz. Se encontrar conteúdo impróprio, use o link "Denunciar conteúdo impróprio" ou escreva para ${OWNER.email}. Resultados denunciados ficam ocultos, e podemos remover conteúdo que viole estes termos. Todo resultado é apagado automaticamente após 180 dias, e quem o criou pode pedir a exclusão antes pelo mesmo e-mail.`,
      ],
    },
    {
      heading: 'Propriedade intelectual',
      paragraphs: [
        `Os textos, os guias, o visual e o código do site são de ${OWNER.name} ou usados com autorização. Você pode usar livremente, para fins pessoais, as sugestões e os textos do seu resultado e compartilhar os links do site. Não é permitido copiar o conteúdo do site em massa ou para fins comerciais sem autorização.`,
        'O que você escreve no quiz continua sendo seu; você nos autoriza a usar esse conteúdo apenas para gerar e exibir o resultado. As marcas, os nomes e as fotos de produtos das lojas pertencem aos respectivos donos.',
      ],
    },
    {
      heading: 'Responsabilidade',
      paragraphs: [
        'Trabalhamos para manter o site no ar e as informações corretas, mas o serviço pode ficar indisponível ou apresentar erros, e não garantimos que a pessoa vai gostar do presente.',
        'Respondemos pelo nosso serviço nos termos da lei. A compra é uma relação entre você e a loja, que responde pela venda, pela entrega e pela garantia do produto. Nada nestes termos limita ou afasta os direitos que o Código de Defesa do Consumidor garante a você.',
      ],
    },
    {
      heading: 'Mudanças nestes termos',
      paragraphs: [
        'Podemos atualizar estes termos quando o site ou a lei mudarem. A data da última atualização aparece nesta página e, se a mudança for relevante, avisaremos no site. Vale a versão publicada no momento do seu uso.',
      ],
    },
    {
      heading: 'Lei aplicável e foro',
      paragraphs: [
        `Estes termos seguem as leis brasileiras, como o Código de Defesa do Consumidor, o Marco Civil da Internet e a LGPD. Você pode levar qualquer disputa ao foro do seu domicílio, como garante o Código de Defesa do Consumidor. Antes disso, se preferir, fale com a gente em ${OWNER.email} para tentarmos resolver de forma simples.`,
      ],
    },
  ],
}

export default page
