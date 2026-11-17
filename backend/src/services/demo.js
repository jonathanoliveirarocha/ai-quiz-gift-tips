// Acervo próprio de ideias: plano B quando a IA está indisponível, lenta ou no teto diário de custo,
// e modo demonstração quando não há GEMINI_API_KEY. Escolhe ideias pelos interesses e pelo orçamento.
import { normalizeTag } from './catalog.js';
import { NAME_TOKEN } from './answers.js';

const IDEAS = [
  ['cafe', 'Moedor de café manual de aço inox', '☕', 'Casa', 'produto', 120, 260, 'moedor de cafe manual'],
  ['cafe', 'Kit de cafés especiais brasileiros', '🫘', 'Gourmet', 'produto', 60, 150, 'kit cafe especial'],
  ['leitura', 'Kindle (modelo de entrada)', '📚', 'Tecnologia', 'produto', 450, 750, 'kindle'],
  ['leitura', 'Luminária de leitura recarregável', '💡', 'Leitura', 'produto', 50, 130, 'luminaria de leitura recarregavel'],
  ['musica', 'Fone Bluetooth JBL Tune 520BT', '🎧', 'Tecnologia', 'produto', 200, 380, 'fone jbl tune 520bt'],
  ['musica', 'Caixa de som Bluetooth portátil', '🔊', 'Tecnologia', 'produto', 100, 300, 'caixa de som bluetooth portatil'],
  ['games', 'Controle sem fio DualSense', '🎮', 'Games', 'produto', 350, 550, 'controle dualsense'],
  ['games', 'Headset gamer com microfone', '🎧', 'Games', 'produto', 150, 350, 'headset gamer'],
  ['series', 'Pipoqueira elétrica + manta de sofá', '🍿', 'Casa', 'produto', 100, 220, 'pipoqueira eletrica'],
  ['vinho', 'Abridor de vinho elétrico com acessórios', '🍷', 'Gourmet', 'produto', 90, 200, 'abridor de vinho eletrico', true],
  ['cerveja', 'Kit de copos para cerveja artesanal', '🍺', 'Gourmet', 'produto', 80, 170, 'kit copos cerveja artesanal', true],
  ['futebol', 'Camisa oficial do time do coração', '⚽', 'Esporte', 'produto', 250, 450, 'camisa oficial time futebol'],
  ['corrida', 'Relógio esportivo com GPS', '⌚', 'Esporte', 'produto', 700, 1600, 'relogio corrida gps'],
  ['corrida', 'Cinto de corrida + garrafinha', '🏃', 'Esporte', 'produto', 50, 120, 'cinto de corrida'],
  ['academia', 'Garrafa térmica de aço inox 1 L', '💪', 'Esporte', 'produto', 80, 220, 'garrafa termica inox 1 litro'],
  ['yoga', 'Tapete de yoga antiderrapante', '🧘', 'Bem-estar', 'produto', 100, 260, 'tapete de yoga antiderrapante'],
  ['plantas', 'Kit de vasos autoirrigáveis com sementes', '🌿', 'Casa', 'produto', 60, 150, 'vaso autoirrigavel kit'],
  ['pets', 'Brinquedo interativo para pet', '🐾', 'Pets', 'produto', 50, 160, 'brinquedo interativo pet'],
  ['fotografia', 'Câmera instantânea Instax Mini', '📸', 'Tecnologia', 'produto', 450, 750, 'instax mini'],
  ['viage', 'Mala de bordo com rodinhas 360°', '🧳', 'Viagem', 'produto', 250, 600, 'mala de bordo'],
  ['viage', 'Kit organizador de mala', '🗺️', 'Viagem', 'produto', 50, 120, 'organizador de mala'],
  ['moda', 'Mochila urbana impermeável', '🎒', 'Moda', 'produto', 150, 380, 'mochila urbana impermeavel'],
  ['skincare', 'Kit de skincare para rotina diária', '🧴', 'Beleza', 'produto', 100, 280, 'kit skincare'],
  ['cozinh', 'Air fryer', '🍳', 'Cozinha', 'produto', 350, 750, 'air fryer'],
  ['cozinh', 'Faca do chef de aço inox', '🔪', 'Cozinha', 'produto', 100, 300, 'faca do chef inox'],
  ['confeitaria', 'Batedeira planetária', '🧁', 'Cozinha', 'produto', 300, 750, 'batedeira planetaria'],
  ['tecnologia', 'Carregador portátil (power bank)', '🔋', 'Tecnologia', 'produto', 80, 220, 'power bank'],
  ['tecnologia', 'Smartwatch com monitor de saúde', '⌚', 'Tecnologia', 'produto', 250, 700, 'smartwatch'],
  ['arte', 'Kit de lápis aquareláveis + sketchbook', '🎨', 'Arte', 'produto', 80, 220, 'kit lapis aquarelavel sketchbook'],
  ['artesanato', 'Kit de bordado para iniciantes', '🧵', 'Arte', 'produto', 50, 140, 'kit bordado iniciante'],
  ['astrologia', 'Livro de astrologia + baralho de tarô', '🔮', 'Astrologia', 'produto', 80, 200, 'livro astrologia baralho taro'],
  ['geek', 'Colecionável do personagem favorito', '🦸', 'Geek', 'produto', 100, 350, 'action figure colecionavel'],
  ['tabuleiro', 'Jogo de tabuleiro Catan', '🎲', 'Jogos', 'produto', 250, 420, 'catan jogo de tabuleiro'],
  ['camping', 'Lanterna de camping recarregável', '🏕️', 'Aventura', 'produto', 70, 200, 'lanterna camping recarregavel'],
  ['bike', 'Kit de luzes LED para bike', '🚲', 'Esporte', 'produto', 50, 150, 'kit farol lanterna bike led'],
  ['praia', 'Bolsa térmica de praia', '🏖️', 'Lazer', 'produto', 70, 160, 'bolsa termica praia'],
  ['decor', 'Luminária de mesa de design', '🛋️', 'Casa', 'produto', 100, 280, 'luminaria de mesa design'],
  ['danca', 'Sapatilha de dança', '💃', 'Dança', 'produto', 60, 200, 'sapatilha de danca'],
].map(([key, title, emoji, category, kind, priceMin, priceMax, query, adultsOnly = false]) => ({
  key, title, emoji, category, kind, priceMin, priceMax, query, adultsOnly,
}));

const FALLBACKS = [
  { key: '', title: 'Bandeja de café da manhã com kit de xícaras', emoji: '🧺', category: 'Casa', kind: 'produto', priceMin: 80, priceMax: 220, query: 'bandeja cafe da manha xicaras' },
  { key: '', title: 'Kit fondue para dois', emoji: '🫕', category: 'Casa', kind: 'produto', priceMin: 100, priceMax: 300, query: 'kit fondue' },
  { key: '', title: 'Caneca térmica de aço inox', emoji: '🥤', category: 'Casa', kind: 'produto', priceMin: 50, priceMax: 150, query: 'caneca termica inox' },
  { key: '', title: 'Álbum de fotos personalizado', emoji: '📖', category: 'Personalizado', kind: 'personalizado', priceMin: 60, priceMax: 200, query: 'album de fotos personalizado' },
  { key: '', title: 'Cartão-presente', emoji: '🎟️', category: 'Vale-presente', kind: 'produto', priceMin: 50, priceMax: 1000, query: 'cartao presente' },
];

export function generateDemo(answers, exclude = []) {
  const keys = [...answers.interests, answers.otherInterest].map(normalizeTag).join(' ');
  const isMinor = /crianca|adolescente/.test(normalizeTag(answers.age));
  const { min, max } = answers.budget;
  const excluded = new Set(exclude.map(normalizeTag));

  const fits = (idea) =>
    !excluded.has(normalizeTag(idea.title)) &&
    !(isMinor && idea.adultsOnly) &&
    (max === null || idea.priceMin <= max) &&
    idea.priceMax >= min * 0.7;

  const matched = IDEAS.filter((idea) => keys.includes(idea.key) && fits(idea));
  const pool = [...matched, ...IDEAS.filter((i) => !matched.includes(i) && fits(i)), ...FALLBACKS.filter(fits)];
  const picks = pool.slice(0, 6);
  while (picks.length < 5) picks.push(FALLBACKS[picks.length % FALLBACKS.length]);

  const name = answers.hasName ? NAME_TOKEN : '';
  const traits = answers.personality.slice(0, 2).map((p) => p.toLowerCase());
  const why = (idea) =>
    `Combina com ${name || 'essa pessoa'} porque conversa com ${idea.key && keys.includes(idea.key) ? `o interesse por ${idea.category.toLowerCase()}` : 'o estilo descrito no quiz'}` +
    `${traits.length ? ` e com o perfil de ${traits.join(' e ')}` : ''}, dentro do orçamento de ${answers.budget.label}.`;
  const toItem = (idea) => ({ ...idea, description: `${idea.title}: uma escolha certeira para ${answers.occasion.toLowerCase()}.`, why: why(idea) });

  const [ideal, ...rest] = picks;
  return {
    profile: {
      archetype: traits.length ? `Perfil ${traits.join(' + ')}` : 'Uma pessoa única',
      summary: traits.length
        ? `Pelas respostas, um perfil de ${traits.join(' e ')}: as ideias abaixo seguem esses interesses e o orçamento escolhido.`
        : 'As ideias abaixo seguem os interesses marcados e o orçamento escolhido.',
      emoji: '✨',
    },
    idealGift: toItem(ideal),
    suggestions: rest.slice(0, 5).map(toItem),
    cardMessage: `${name ? `${name}, ` : ''}escolhi este presente pensando em você e em tudo que te faz feliz. Que ele traga muitos momentos bons!`,
    deliveryTip: 'Entregue junto com um bilhete escrito à mão contando por que você lembrou dessa pessoa ao escolher o presente.',
    avoid: ['Presentes genéricos sem relação com os interesses'],
    tags: [...answers.interests, ...answers.personality].map(normalizeTag),
  };
}
