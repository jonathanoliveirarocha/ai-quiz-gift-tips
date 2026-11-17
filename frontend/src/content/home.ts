import { STORE_LIST } from './stores.ts'

export const SITE_NAME = 'Presente Certo'

export const HOME = {
  title: 'Ideias de presente com IA: quiz grátis | Presente Certo',
  description:
    'Não sabe o que dar de presente? Responda 11 perguntas rápidas e a IA indica o presente ideal, com opções em lojas confiáveis. Grátis e sem cadastro.',
  ogTitle: 'Presente Certo: a IA descobre o presente ideal',
  ogDescription: 'Responda perguntas rápidas sobre a pessoa e a IA indica o presente certo. Grátis, em 2 minutos e sem cadastro.',
  updated: '2026-11-16',
}

export const HOME_FAQ: { q: string; a: string }[] = [
  {
    q: 'Como a IA descobre o presente ideal?',
    a: 'Você responde 11 perguntas sobre a pessoa: relação, idade, ocasião, orçamento, jeito, gostos, como é o sábado perfeito dela e o que ela já tem ou não curte. A IA cruza tudo isso e indica um presente principal, explica por que ele combina e sugere outras ideias dentro do mesmo orçamento.',
  },
  {
    q: 'O Presente Certo é grátis?',
    a: 'Sim. O quiz e as sugestões são gratuitos e não pedem cadastro, e-mail nem cartão. Alguns links para as lojas podem ser de afiliados: se você comprar por eles, a loja pode pagar uma comissão ao site, sem nenhum custo extra para você.',
  },
  {
    q: 'Em quais lojas posso comprar o presente sugerido?',
    a: `Cada sugestão traz botões que abrem a busca do presente nas lojas ${STORE_LIST}. Os preços mostrados são estimativas; o valor final, o frete e o prazo de entrega você confere na própria loja antes de comprar.`,
  },
  {
    q: 'Posso compartilhar o resultado com outra pessoa?',
    a: 'Pode. Cada resultado ganha um link próprio, que você envia pelo WhatsApp ou por qualquer outro aplicativo. Quem abrir o link vê o presente ideal, as outras ideias e a mensagem sugerida para o cartão, e pode fazer o próprio quiz.',
  },
  {
    q: 'Minhas respostas ficam salvas?',
    a: 'As respostas e o resultado ficam guardados para que o link do resultado continue funcionando. Por isso, use só o primeiro nome ou um apelido e não escreva dados pessoais sensíveis, como telefone, endereço ou documentos, nos campos de texto.',
  },
  {
    q: 'E se eu não gostar das sugestões?',
    a: 'No resultado, toque em "Quero outras ideias" para receber novas opções sem repetir as anteriores, ou em "Ajustar respostas" para mudar o orçamento, os gostos ou o estilo de presente. Quanto mais detalhes você der no campo "algo especial", mais certeira fica a sugestão.',
  },
]
