// Modo demonstração: usado quando não há GEMINI_API_KEY. Escolhe ideias de um banco fixo
// com base nos interesses e no orçamento, para o site funcionar de ponta a ponta sem IA.
import { normalizeTag } from './catalog.js';

const IDEAS = [
  ['cafe', 'Moedor de café manual de aço inox', '☕', 'Casa', 'produto', 120, 260, 'moedor de cafe manual', ['amazon', 'mercadolivre', 'magalu']],
  ['cafe', 'Kit de cafés especiais brasileiros', '🫘', 'Gourmet', 'produto', 60, 150, 'kit cafe especial', ['amazon', 'mercadolivre']],
  ['leitura', 'Kindle (modelo de entrada)', '📚', 'Tecnologia', 'produto', 450, 750, 'kindle', ['amazon', 'magalu', 'mercadolivre']],
  ['leitura', 'Luminária de leitura recarregável', '💡', 'Leitura', 'produto', 50, 130, 'luminaria de leitura recarregavel', ['amazon', 'shopee', 'mercadolivre']],
  ['musica', 'Fone Bluetooth JBL Tune 520BT', '🎧', 'Tecnologia', 'produto', 200, 380, 'fone jbl tune 520bt', ['amazon', 'magalu', 'mercadolivre']],
  ['musica', 'Caixa de som Bluetooth portátil', '🔊', 'Tecnologia', 'produto', 100, 300, 'caixa de som bluetooth portatil', ['amazon', 'kabum', 'mercadolivre']],
  ['games', 'Controle sem fio DualSense', '🎮', 'Games', 'produto', 350, 550, 'controle dualsense', ['kabum', 'amazon', 'mercadolivre']],
  ['games', 'Headset gamer com microfone', '🎧', 'Games', 'produto', 150, 350, 'headset gamer', ['kabum', 'amazon', 'mercadolivre']],
  ['series', 'Pipoqueira elétrica + manta de sofá', '🍿', 'Casa', 'produto', 100, 220, 'pipoqueira eletrica', ['magalu', 'amazon', 'americanas']],
  ['vinho', 'Abridor de vinho elétrico com acessórios', '🍷', 'Gourmet', 'produto', 90, 200, 'abridor de vinho eletrico', ['amazon', 'mercadolivre'], true],
  ['cerveja', 'Kit de copos para cerveja artesanal', '🍺', 'Gourmet', 'produto', 80, 170, 'kit copos cerveja artesanal', ['amazon', 'mercadolivre'], true],
  ['futebol', 'Camisa oficial do time do coração', '⚽', 'Esporte', 'produto', 250, 450, 'camisa oficial time futebol', ['amazon', 'mercadolivre', 'google_shopping']],
  ['corrida', 'Relógio esportivo com GPS', '⌚', 'Esporte', 'produto', 700, 1600, 'relogio corrida gps', ['amazon', 'magalu', 'mercadolivre']],
  ['corrida', 'Cinto de corrida + garrafinha', '🏃', 'Esporte', 'produto', 50, 120, 'cinto de corrida', ['amazon', 'shopee', 'mercadolivre']],
  ['academia', 'Garrafa térmica de aço inox 1 L', '💪', 'Esporte', 'produto', 80, 220, 'garrafa termica inox 1 litro', ['amazon', 'mercadolivre', 'magalu']],
  ['yoga', 'Tapete de yoga antiderrapante', '🧘', 'Bem-estar', 'produto', 100, 260, 'tapete de yoga antiderrapante', ['amazon', 'mercadolivre', 'shopee']],
  ['plantas', 'Kit de vasos autoirrigáveis com sementes', '🌿', 'Casa', 'produto', 60, 150, 'vaso autoirrigavel kit', ['amazon', 'mercadolivre', 'shopee']],
  ['pets', 'Brinquedo interativo para pet', '🐾', 'Pets', 'produto', 50, 160, 'brinquedo interativo pet', ['amazon', 'mercadolivre', 'shopee']],
  ['fotografia', 'Câmera instantânea Instax Mini', '📸', 'Tecnologia', 'produto', 450, 750, 'instax mini', ['amazon', 'magalu', 'mercadolivre']],
  ['viage', 'Mala de bordo com rodinhas 360°', '🧳', 'Viagem', 'produto', 250, 600, 'mala de bordo', ['amazon', 'magalu', 'mercadolivre']],
  ['viage', 'Kit organizador de mala', '🗺️', 'Viagem', 'produto', 50, 120, 'organizador de mala', ['amazon', 'shopee', 'mercadolivre']],
  ['moda', 'Mochila urbana impermeável', '🎒', 'Moda', 'produto', 150, 380, 'mochila urbana impermeavel', ['amazon', 'mercadolivre', 'americanas']],
  ['skincare', 'Kit de skincare para rotina diária', '🧴', 'Beleza', 'produto', 100, 280, 'kit skincare', ['amazon', 'mercadolivre', 'americanas']],
  ['cozinh', 'Air fryer', '🍳', 'Cozinha', 'produto', 350, 750, 'air fryer', ['magalu', 'amazon', 'americanas']],
  ['cozinh', 'Faca do chef de aço inox', '🔪', 'Cozinha', 'produto', 100, 300, 'faca do chef inox', ['amazon', 'mercadolivre', 'magalu']],
  ['confeitaria', 'Batedeira planetária', '🧁', 'Cozinha', 'produto', 300, 750, 'batedeira planetaria', ['magalu', 'amazon', 'americanas']],
  ['tecnologia', 'Carregador portátil (power bank)', '🔋', 'Tecnologia', 'produto', 80, 220, 'power bank', ['amazon', 'kabum', 'mercadolivre']],
  ['tecnologia', 'Smartwatch com monitor de saúde', '⌚', 'Tecnologia', 'produto', 250, 700, 'smartwatch', ['amazon', 'magalu', 'kabum']],
  ['arte', 'Kit de lápis aquareláveis + sketchbook', '🎨', 'Arte', 'produto', 80, 220, 'kit lapis aquarelavel sketchbook', ['amazon', 'mercadolivre', 'shopee']],
  ['artesanato', 'Kit de bordado para iniciantes', '🧵', 'Arte', 'produto', 50, 140, 'kit bordado iniciante', ['amazon', 'shopee', 'mercadolivre']],
  ['astrologia', 'Consulta de mapa astral', '🔮', 'Experiência', 'experiencia', 100, 300, 'consulta mapa astral online', ['google']],
  ['geek', 'Colecionável do personagem favorito', '🦸', 'Geek', 'produto', 100, 350, 'action figure colecionavel', ['amazon', 'mercadolivre', 'shopee']],
  ['tabuleiro', 'Jogo de tabuleiro Catan', '🎲', 'Jogos', 'produto', 250, 420, 'catan jogo de tabuleiro', ['amazon', 'mercadolivre', 'magalu']],
  ['camping', 'Lanterna de camping recarregável', '🏕️', 'Aventura', 'produto', 70, 200, 'lanterna camping recarregavel', ['amazon', 'mercadolivre', 'shopee']],
  ['bike', 'Kit de luzes LED para bike', '🚲', 'Esporte', 'produto', 50, 150, 'kit farol lanterna bike led', ['amazon', 'mercadolivre', 'shopee']],
  ['praia', 'Bolsa térmica de praia', '🏖️', 'Lazer', 'produto', 70, 160, 'bolsa termica praia', ['amazon', 'mercadolivre', 'shopee']],
  ['decor', 'Luminária de mesa de design', '🛋️', 'Casa', 'produto', 100, 280, 'luminaria de mesa design', ['amazon', 'mercadolivre', 'magalu']],
  ['danca', 'Aula experimental de dança', '💃', 'Experiência', 'experiencia', 50, 150, 'aula de danca experimental', ['google']],
].map(([key, title, emoji, category, kind, priceMin, priceMax, query, stores, adultsOnly = false]) => ({
  key, title, emoji, category, kind, priceMin, priceMax, query, stores, adultsOnly,
}));

const FALLBACKS = [
  { key: '', title: 'Cesta de café da manhã personalizada', emoji: '🧺', category: 'Experiência', kind: 'personalizado', priceMin: 120, priceMax: 280, query: 'cesta de cafe da manha personalizada', stores: ['google'] },
  { key: '', title: 'Jantar especial a dois', emoji: '🍽️', category: 'Experiência', kind: 'experiencia', priceMin: 150, priceMax: 400, query: 'restaurante para jantar especial', stores: ['google'] },
  { key: '', title: 'Caneca térmica de aço inox', emoji: '🥤', category: 'Casa', kind: 'produto', priceMin: 50, priceMax: 150, query: 'caneca termica inox', stores: ['amazon', 'mercadolivre', 'shopee'] },
  { key: '', title: 'Álbum de fotos personalizado', emoji: '📖', category: 'Personalizado', kind: 'personalizado', priceMin: 60, priceMax: 200, query: 'album de fotos personalizado', stores: ['google_shopping', 'mercadolivre'] },
  { key: '', title: 'Vale-presente de uma loja favorita', emoji: '🎟️', category: 'Vale-presente', kind: 'produto', priceMin: 50, priceMax: 1000, query: 'vale presente', stores: ['amazon', 'google_shopping'] },
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

  const name = answers.name;
  const traits = answers.personality.slice(0, 2).map((p) => p.toLowerCase());
  const why = (idea) =>
    `Combina com ${name || 'essa pessoa'} porque conversa com ${idea.key && keys.includes(idea.key) ? `o interesse por ${idea.category.toLowerCase()}` : 'o estilo descrito no quiz'}` +
    `${traits.length ? ` e com o perfil de ${traits.join(' e ')}` : ''}, dentro do orçamento de ${answers.budget.label}.`;
  const toItem = (idea) => ({ ...idea, description: `${idea.title}: uma escolha certeira para ${answers.occasion.toLowerCase()}.`, why: why(idea) });

  const [ideal, ...rest] = picks;
  return {
    profile: {
      archetype: traits.length ? `Perfil ${traits.join(' + ')}` : 'Uma pessoa única',
      summary: `Modo demonstração: este perfil foi montado sem IA, a partir dos interesses marcados. Configure a chave do Gemini para receber uma análise de verdade.`,
      emoji: '✨',
    },
    idealGift: { ...toItem(ideal), confidence: matched.length ? 82 : 64 },
    suggestions: rest.slice(0, 5).map(toItem),
    cardMessage: `${name ? `${name}, ` : ''}escolhi este presente pensando em você e em tudo que te faz feliz. Que ele traga muitos momentos bons!`,
    deliveryTip: 'Entregue junto com um bilhete escrito à mão contando por que você lembrou dessa pessoa ao escolher o presente.',
    avoid: ['Presentes genéricos sem relação com os interesses'],
    tags: [...answers.interests, ...answers.personality].map(normalizeTag),
  };
}
