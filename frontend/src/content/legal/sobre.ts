import type { LegalPage } from './types.ts'
import { OWNER } from './owner.ts'

const page: LegalPage = {
  slug: 'quem-somos',
  title: 'Quem somos | Presente Certo',
  description:
    'Conheça quem está por trás do Presente Certo, como a IA escolhe as sugestões de presente, como o site ganha dinheiro e como falar com a gente.',
  h1: 'Quem somos',
  updated: '2026-11-17',
  intro:
    'O Presente Certo é um site gratuito que ajuda você a escolher um presente que combine com quem vai ganhar, em poucos minutos e sem cadastro.',
  sections: [
    {
      heading: 'Quem está por trás',
      paragraphs: [
        `O site é mantido por ${OWNER.name} (${OWNER.document}), de ${OWNER.city}, que responde pelo serviço, pelos dados tratados e pelo conteúdo publicado.`,
      ],
    },
    {
      heading: 'Nossa missão',
      paragraphs: [
        'Ajudar a responder "o que eu dou de presente?" olhando para a pessoa, e não para a vitrine. Queremos que você saia daqui com ideias que façam sentido para o jeito de quem vai ganhar, dentro do seu orçamento, e com um caminho fácil até lojas conhecidas.',
      ],
    },
    {
      heading: 'Como as recomendações funcionam',
      paragraphs: ['Funciona assim, passo a passo:'],
      items: [
        'Você responde 11 perguntas sobre quem vai ganhar: relação, idade, ocasião, orçamento, personalidade, interesses, o sábado perfeito e o que a pessoa já tem ou não curte.',
        'O nome ou apelido fica no seu navegador. As outras respostas vão para a API Gemini, a inteligência artificial do Google, que escolhe um presente principal, sugere outras ideias e explica por que elas combinam com a pessoa.',
        'O site filtra automaticamente bebidas alcoólicas e itens impróprios quando o presente é para menor de idade.',
        'A IA escolhe só o termo de busca de cada ideia. Os links das lojas são montados pelo próprio site, com um botão para cada loja parceira.',
        'Se a IA estiver indisponível, as ideias vêm de um banco interno, e o site avisa.',
        'A IA pode errar, e os preços que ela mostra são estimativas. Antes de comprar, confira na loja o preço, o frete, a composição e a indicação de idade.',
      ],
    },
    {
      heading: 'Como ganhamos dinheiro',
      paragraphs: [
        'O quiz é gratuito. O site se mantém com links de afiliado da Amazon e da Shopee: se você comprar por eles, a loja pode nos pagar uma comissão, sem custo extra para você. As "Ofertas selecionadas" também são produtos de parceiros com link de afiliado, escolhidos pela combinação com o seu resultado, e ninguém paga por posição.',
        'Como participante do Programa de Associados da Amazon, sou remunerado pelas compras qualificadas efetuadas.',
      ],
    },
    {
      heading: 'Como fazemos os guias de presentes',
      paragraphs: [
        'Os guias por pessoa e ocasião são escritos com apoio de inteligência artificial e seguem critérios editoriais próprios:',
      ],
      items: [
        'indicar apenas itens à venda em lojas conhecidas;',
        'evitar estereótipos sobre quem vai ganhar;',
        'considerar cuidados de segurança.',
      ],
    },
    {
      heading: 'Fale com a gente',
      paragraphs: [
        `Dúvidas, sugestões, denúncias, erros nos guias e pedidos sobre dados pessoais: ${OWNER.email}. Para saber como tratamos seus dados e quais são as regras do site, leia a Política de Privacidade e os Termos de Uso.`,
      ],
    },
  ],
}

export default page
