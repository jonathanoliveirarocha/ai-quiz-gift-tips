import type { LegalPage } from './types.ts'
import { OWNER } from './owner.ts'

const page: LegalPage = {
  slug: 'politica-de-privacidade',
  title: 'Política de Privacidade | Presente Certo',
  description:
    'Saiba quais dados o Presente Certo usa no quiz de presentes, para quê, por quanto tempo e como pedir a exclusão. Sem cadastro e sem cookies próprios.',
  h1: 'Política de Privacidade',
  updated: '2026-11-17',
  intro:
    'Esta política explica, em linguagem simples, quais dados o Presente Certo usa, para quê, com quem compartilha e por quanto tempo guarda. Em resumo: não há cadastro, o nome de quem vai ganhar o presente não sai do seu navegador e não guardamos os textos livres do quiz.',
  sections: [
    {
      heading: 'Quem é o responsável',
      paragraphs: [
        `O controlador dos dados, nos termos da Lei Geral de Proteção de Dados (LGPD, Lei 13.709/2018), é ${OWNER.name} (${OWNER.document}), de ${OWNER.city}. O canal do encarregado pelo tratamento de dados pessoais é o e-mail ${OWNER.email}.`,
      ],
    },
    {
      heading: 'Quais dados usamos e para quê',
      paragraphs: [
        'Tratamos dados de quem usa o site e, principalmente, informações sobre quem vai ganhar o presente:',
      ],
      items: [
        'Nome ou apelido: fica só no seu navegador. Não é enviado aos nossos servidores nem à IA; a IA escreve um marcador, e o navegador o troca pelo nome.',
        'Demais respostas, inclusive os textos livres: enviadas à IA só para gerar as sugestões.',
        'Resultado e respostas que não identificam ninguém (relação, faixa de idade, ocasião, orçamento, personalidade, interesses da lista, sábado perfeito, escalas e pronome): guardados para o link do resultado funcionar e para gerar "outras ideias". Não guardamos o nome nem os textos livres ("outro interesse", "o que já tem ou não curte" e "algo especial").',
        'Cliques nos botões das lojas (loja, presente, resultado, origem da visita, como "instagram" ou "busca orgânica", e data): para saber o que funciona e conferir comissões.',
        'Eventos anônimos de uso (como "começou o quiz", "chegou à pergunta 5" e "viu o resultado"), ligados a um código aleatório de sessão: para melhorar o quiz.',
        'Visitas e desempenho das páginas, medidos sem cookies e de forma agregada (Vercel Web Analytics e Speed Insights): para saber o que é visto e se o site está rápido.',
        'Um código embaralhado derivado do IP em contadores de limite de uso, por pouco tempo (veja os prazos abaixo), e sinais técnicos do navegador na verificação anti-robô Cloudflare Turnstile, quando ativada: para evitar abuso.',
        'Endereço IP, data e hora de cada envio do quiz: guardados sob sigilo, conforme o art. 15 do Marco Civil da Internet (Lei 12.965/2014), e só entregues mediante ordem judicial.',
        'Mensagens enviadas ao nosso e-mail: para responder ao seu pedido.',
      ],
    },
    {
      heading: 'Base legal',
      paragraphs: [
        'Usamos o legítimo interesse (art. 7º, IX, da LGPD) para prestar o serviço pedido, medir e melhorar o site e evitar abuso, com o mínimo de dados. O registro do Marco Civil e o atendimento a pedidos da LGPD se apoiam no cumprimento de obrigação legal (art. 7º, II).',
      ],
    },
    {
      heading: 'Dados sensíveis',
      paragraphs: [
        'Dados sensíveis, como os de saúde, religião, origem racial, opinião política ou vida sexual (art. 5º, II, da LGPD), não são necessários para sugerir um presente e exigem proteção especial. Por isso não os pedimos, e os campos de texto livre avisam para não escrever dados de saúde, documentos, endereço, telefone nem nome completo de crianças. Se algo assim for escrito, vai para a IA só para gerar aquele resultado e não é gravado no nosso banco de dados.',
      ],
    },
    {
      heading: 'Dados de outras pessoas e de crianças',
      paragraphs: [
        'As respostas descrevem outra pessoa, que em geral não sabe do quiz. Por isso, guardamos só respostas que não a identificam e pedimos que você não escreva nada que a identifique.',
        'Se o presente for para criança ou adolescente, recebemos só a faixa de idade e gostos gerais, nunca o nome. Usamos isso para sugerir itens adequados e filtrar automaticamente bebidas alcoólicas e itens impróprios, no melhor interesse da criança e do adolescente (art. 14 da LGPD).',
      ],
    },
    {
      heading: 'Com quem compartilhamos',
      paragraphs: [
        'Só com fornecedores necessários para o site funcionar e com autoridades, quando a lei exigir ou houver ordem judicial:',
      ],
      items: [
        'Google LLC (API Gemini): recebe as respostas, exceto o nome, para gerar as sugestões. Usamos o plano pago, no qual, segundo os termos do Google, o conteúdo não é usado para treinar modelos; ele pode ser guardado por tempo limitado para detectar abuso e cumprir obrigações legais.',
        'MongoDB, Inc. (MongoDB Atlas): banco de dados em nuvem onde ficam os dados que guardamos.',
        'Vercel Inc.: hospeda o site, processa dados de conexão, como o IP, para entregar as páginas e mede visitas e desempenho.',
        'Cloudflare, Inc.: analisa sinais do navegador para distinguir pessoas de robôs, quando o Turnstile estiver ativado.',
        'Amazon, Shopee e lojas parceiras: só quando você clica em um botão de loja. O link leva o termo de busca ou o produto e o nosso código de afiliado, não as suas respostas. Na loja, valem a política de privacidade e os cookies dela.',
      ],
    },
    {
      heading: 'Transferência internacional',
      paragraphs: [
        'Google, MongoDB, Vercel e Cloudflare podem processar dados fora do Brasil. Essas transferências se limitam ao necessário e se apoiam nos instrumentos contratuais de proteção de dados desses fornecedores, como prevê o art. 33 da LGPD.',
      ],
    },
    {
      heading: 'Por quanto tempo guardamos',
      paragraphs: [],
      items: [
        'Resultado e respostas não identificáveis: até 180 dias, com exclusão automática, ou menos, se você pedir a exclusão antes.',
        'Cliques nos botões das lojas: 13 meses.',
        'IP, data e hora de envio do quiz (Marco Civil): 6 meses.',
        'Código derivado do IP (embaralhado, sem guardar o IP) nos contadores de limite de uso: de alguns minutos a 1 hora; no caso de denúncias, 30 dias, para impedir que a mesma pessoa denuncie duas vezes.',
        'Eventos anônimos de uso: 13 meses. Eles não identificam ninguém, e o código de sessão some do navegador ao fechar a aba.',
        'Nome e textos livres: não são guardados por nós.',
        'E-mails: pelo tempo necessário para responder e comprovar o atendimento.',
      ],
    },
    {
      heading: 'Seus direitos e como exercê-los',
      paragraphs: [
        'Pela LGPD (art. 18), você pode pedir confirmação e acesso aos seus dados, correção, anonimização, bloqueio ou eliminação, portabilidade e informação sobre compartilhamento, além de se opor a tratamentos baseados em legítimo interesse.',
        `Para apagar um resultado ou fazer outros pedidos, escreva para ${OWNER.email}. Como não há cadastro, envie o link do resultado ou outros dados que ajudem a localizá-lo; podemos pedir confirmação para evitar pedidos em nome de outra pessoa. Responderemos nos prazos da LGPD. Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).`,
      ],
    },
    {
      heading: 'Armazenamento no seu navegador',
      paragraphs: [
        'Não usamos cookies próprios. O nome ou apelido fica só na página enquanto você usa o site e, se você compartilhar o resultado, no próprio link, depois do símbolo #. Um código de sessão anônimo fica no sessionStorage do navegador e some ao fechar a aba.',
      ],
    },
    {
      heading: 'Resultados compartilhados',
      paragraphs: [
        'Quem tiver o link de um resultado, que usa um código aleatório longo e difícil de adivinhar, vê as ideias e os textos, mas não as respostas do quiz. Ao compartilhar, o nome ou apelido vai no link, depois do símbolo #. Os navegadores não enviam essa parte aos servidores, mas quem receber o link verá o nome, e o aplicativo usado no envio recebe o link inteiro. Resultados denunciados pelo botão "Denunciar" ficam ocultos.',
      ],
    },
    {
      heading: 'Segurança',
      paragraphs: [
        'Usamos conexão criptografada (HTTPS), limites de uso e verificação anti-robô quando ativada, e guardamos o mínimo de dados, por prazos definidos. Nenhum sistema é imune a falhas: se houver incidente que possa causar risco ou dano relevante, comunicaremos a ANPD e as pessoas afetadas, inclusive por aviso no site (art. 48 da LGPD).',
      ],
    },
    {
      heading: 'Menores de 18 anos',
      paragraphs: [
        `O serviço é destinado a maiores de 18 anos, que confirmam a idade no botão final do quiz. Se souber que um menor o usou, envie o link do resultado para ${OWNER.email}, e nós o apagaremos.`,
      ],
    },
    {
      heading: 'Alterações desta política',
      paragraphs: [
        'Podemos atualizar esta política. A data da última atualização aparece nesta página e, se a mudança for relevante, avisaremos no site.',
      ],
    },
    {
      heading: 'Contato',
      paragraphs: [`Dúvidas, pedidos sobre seus dados e denúncias: ${OWNER.email}.`],
    },
  ],
}

export default page
