import type { Answers, Budget } from './types.ts'

export type Option = { value: string; emoji: string }

type SingleField = 'relationship' | 'age' | 'occasion' | 'perfectSaturday'
type MultiField = 'personality' | 'interests'
type TextField = 'avoid' | 'special'

type Copy = { title: (who: string) => string; subtitle?: (who: string) => string; optional?: boolean }

export type Step = Copy &
  (
    | { kind: 'name' }
    | { kind: 'single'; field: SingleField; options: Option[]; compact?: boolean }
    | { kind: 'budget' }
    | { kind: 'multi'; field: MultiField; options: Option[]; max: number; other?: boolean }
    | { kind: 'scales' }
    | { kind: 'text'; field: TextField; placeholder: string; starters: string[] }
  )

export const BUDGETS: (Budget & { emoji: string })[] = [
  { label: 'Até R$ 50', min: 0, max: 50, emoji: '🪙' },
  { label: 'R$ 50 a R$ 100', min: 50, max: 100, emoji: '💵' },
  { label: 'R$ 100 a R$ 200', min: 100, max: 200, emoji: '💳' },
  { label: 'R$ 200 a R$ 500', min: 200, max: 500, emoji: '💎' },
  { label: 'R$ 500 a R$ 1.000', min: 500, max: 1000, emoji: '👑' },
  { label: 'Acima de R$ 1.000', min: 1000, max: null, emoji: '🚀' },
]

export const SCALES = [
  { key: 'practicalSentimental', left: 'Prático', leftEmoji: '🧰', right: 'Sentimental', rightEmoji: '💌' },
  { key: 'classicBold', left: 'Clássico', leftEmoji: '🎩', right: 'Inusitado', rightEmoji: '🦄' },
  { key: 'objectExperience', left: 'Objeto', leftEmoji: '📦', right: 'Experiência', rightEmoji: '🎟️' },
] as const

export const STEPS: Step[] = [
  {
    kind: 'name',
    title: () => 'Pra quem é o presente?',
    subtitle: () => 'Opcional. Ele aparece só no resultado.',
    optional: true,
  },
  {
    kind: 'single',
    field: 'relationship',
    title: (who) => `Qual é a sua relação com ${who}?`,
    options: [
      { value: 'Mãe', emoji: '👩' },
      { value: 'Pai', emoji: '👨' },
      { value: 'Par romântico', emoji: '💞' },
      { value: 'Amigo ou amiga', emoji: '🤝' },
      { value: 'Irmão ou irmã', emoji: '🧑‍🤝‍🧑' },
      { value: 'Filho ou filha', emoji: '🧒' },
      { value: 'Avô ou avó', emoji: '👵' },
      { value: 'Colega de trabalho', emoji: '💼' },
      { value: 'Chefe', emoji: '🏢' },
      { value: 'Amigo secreto', emoji: '🤫' },
      { value: 'Eu mesmo', emoji: '😎' },
      { value: 'Outra pessoa', emoji: '✨' },
    ],
  },
  {
    kind: 'single',
    field: 'age',
    title: (who) => `Qual a idade de ${who}?`,
    compact: true,
    options: [
      { value: 'Criança (até 5 anos)', emoji: '🍼' },
      { value: 'Criança (6 a 12 anos)', emoji: '🪁' },
      { value: 'Adolescente (13 a 17 anos)', emoji: '🎧' },
      { value: '18 a 25 anos', emoji: '🎓' },
      { value: '26 a 35 anos', emoji: '🚀' },
      { value: '36 a 50 anos', emoji: '🌟' },
      { value: '51 a 65 anos', emoji: '🌻' },
      { value: 'Mais de 65 anos', emoji: '🫖' },
    ],
  },
  {
    kind: 'single',
    field: 'occasion',
    title: () => 'Qual é a ocasião?',
    options: [
      { value: 'Natal', emoji: '🎄' },
      { value: 'Aniversário', emoji: '🎂' },
      { value: 'Amigo secreto', emoji: '🎁' },
      { value: 'Data de namoro ou casamento', emoji: '💘' },
      { value: 'Dia das Mães', emoji: '💐' },
      { value: 'Dia dos Pais', emoji: '👔' },
      { value: 'Formatura ou conquista', emoji: '🏆' },
      { value: 'Casamento ou chá', emoji: '💍' },
      { value: 'Agradecimento', emoji: '🙏' },
      { value: 'Só porque sim', emoji: '💝' },
    ],
  },
  {
    kind: 'budget',
    title: () => 'Quanto você quer investir?',
    subtitle: () => 'As sugestões são pensadas para esse valor (os preços são estimativas).',
  },
  {
    kind: 'multi',
    field: 'personality',
    optional: true,
    max: 4,
    title: (who) => `Como é o jeito de ${who}?`,
    subtitle: () => 'Escolha até 4 traços que mais combinam. Não conhece bem? Pode pular.',
    options: [
      { value: 'Aventura e adrenalina', emoji: '🧗' },
      { value: 'Curte ficar em casa', emoji: '🛋️' },
      { value: 'Criatividade', emoji: '🎨' },
      { value: 'Tecnologia e gadgets', emoji: '💻' },
      { value: 'Vida fitness', emoji: '💪' },
      { value: 'Comer bem', emoji: '🍝' },
      { value: 'Cultura e conhecimento', emoji: '🧠' },
      { value: 'Vaidade e autocuidado', emoji: '💅' },
      { value: 'Praticidade e organização', emoji: '🗂️' },
      { value: 'Nostalgia', emoji: '📼' },
      { value: 'Romantismo', emoji: '🌹' },
      { value: 'Bom humor', emoji: '😂' },
      { value: 'Minimalismo', emoji: '🤍' },
      { value: 'Colecionar coisas', emoji: '🧸' },
      { value: 'Natureza', emoji: '🌿' },
      { value: 'Festa e agito', emoji: '🎉' },
      { value: 'Paz e espiritualidade', emoji: '🧘' },
      { value: 'Estilo e elegância', emoji: '🕶️' },
    ],
  },
  {
    kind: 'multi',
    field: 'interests',
    max: 8,
    other: true,
    title: (who) => `Do que ${who} gosta?`,
    subtitle: () => 'Escolha até 8. Quanto mais certeiro, melhor o presente.',
    options: [
      { value: 'Música', emoji: '🎵' },
      { value: 'Café', emoji: '☕' },
      { value: 'Vinhos e drinks', emoji: '🍷' },
      { value: 'Cerveja artesanal', emoji: '🍺' },
      { value: 'Leitura', emoji: '📚' },
      { value: 'Séries e filmes', emoji: '🎬' },
      { value: 'Games', emoji: '🎮' },
      { value: 'Futebol', emoji: '⚽' },
      { value: 'Corrida', emoji: '🏃' },
      { value: 'Academia', emoji: '🏋️' },
      { value: 'Yoga e meditação', emoji: '🧘' },
      { value: 'Plantas', emoji: '🪴' },
      { value: 'Pets', emoji: '🐾' },
      { value: 'Fotografia', emoji: '📸' },
      { value: 'Viagens', emoji: '✈️' },
      { value: 'Moda', emoji: '👗' },
      { value: 'Skincare e beleza', emoji: '🧴' },
      { value: 'Cozinhar', emoji: '🍳' },
      { value: 'Confeitaria', emoji: '🧁' },
      { value: 'Tecnologia', emoji: '📱' },
      { value: 'Arte e desenho', emoji: '🖌️' },
      { value: 'Artesanato', emoji: '🧶' },
      { value: 'Astrologia', emoji: '🔮' },
      { value: 'Anime e cultura geek', emoji: '🦸' },
      { value: 'Jogos de tabuleiro', emoji: '🎲' },
      { value: 'Camping e trilhas', emoji: '🏕️' },
      { value: 'Bike', emoji: '🚲' },
      { value: 'Praia', emoji: '🏖️' },
      { value: 'Decoração', emoji: '🛋️' },
      { value: 'Dança', emoji: '💃' },
    ],
  },
  {
    kind: 'single',
    field: 'perfectSaturday',
    optional: true,
    title: (who) => `Como é o sábado perfeito de ${who}?`,
    options: [
      { value: 'Maratonando séries no sofá', emoji: '🛋️' },
      { value: 'Numa trilha ou na natureza', emoji: '🥾' },
      { value: 'Numa festa com amigos', emoji: '🎉' },
      { value: 'Cozinhando um almoço caprichado', emoji: '🍲' },
      { value: 'Com um livro e um café', emoji: '📖' },
      { value: 'Jogando videogame', emoji: '🎮' },
      { value: 'Passeando e fazendo compras', emoji: '🛍️' },
      { value: 'Explorando um lugar novo', emoji: '🗺️' },
      { value: 'Treinando ou praticando esporte', emoji: '🏅' },
      { value: 'Criando algo com as mãos', emoji: '✂️' },
      { value: 'Cuidando da casa e das plantas', emoji: '🪴' },
      { value: 'Dormindo até tarde', emoji: '😴' },
    ],
  },
  {
    kind: 'scales',
    title: () => 'Que tipo de presente você imagina?',
    subtitle: () => 'Arraste para indicar o estilo. Deixe no meio se tanto faz.',
  },
  {
    kind: 'text',
    field: 'avoid',
    optional: true,
    title: (who) => `O que ${who} já tem ou não curte?`,
    subtitle: () => 'Assim a IA não repete o que já existe nem erra o gosto. Não escreva dados de saúde, documentos ou contatos.',
    placeholder: 'Ex.: já tem Kindle, não bebe álcool, não usa perfume, odeia rosa...',
    starters: ['Já tem ', 'Não gosta de ', 'Não usa ', 'Não come '],
  },
  {
    kind: 'text',
    field: 'special',
    optional: true,
    title: (who) => `Conte algo especial sobre ${who}`,
    subtitle: () => 'Uma mania, um sonho, uma piada interna, algo que comentou que queria. É esse detalhe que faz a IA acertar em cheio. Evite nome completo, endereço ou dados pessoais.',
    placeholder: 'Ex.: vive dizendo que quer aprender a fazer pão; a gente tem uma piada interna sobre capivaras...',
    starters: ['Vive dizendo que quer ', 'Sonha em ', 'A gente tem uma piada interna sobre ', 'Está numa fase de ', 'Comentou que queria '],
  },
]

export const emptyAnswers = (): Answers => ({
  name: '',
  pronoun: 'neutro',
  relationship: '',
  age: '',
  occasion: '',
  budget: null,
  personality: [],
  interests: [],
  otherInterest: '',
  perfectSaturday: '',
  style: { practicalSentimental: 3, classicBold: 3, objectExperience: 3 },
  avoid: '',
  special: '',
})

export const who = (answers: Answers) => answers.name.trim() || 'essa pessoa'

/** A etapa já tem resposta (usado para pular o que veio preenchido de um guia). */
export function isStepAnswered(step: Step, answers: Answers) {
  switch (step.kind) {
    case 'name':
      return answers.name.trim().length > 0
    case 'single':
      return Boolean(answers[step.field])
    case 'budget':
      return answers.budget !== null
    case 'multi':
      return answers[step.field].length > 0 || (step.other === true && answers.otherInterest.trim().length > 0)
    case 'scales':
      return false
    case 'text':
      return answers[step.field].trim().length > 0
  }
}

/** Pode avançar: etapas opcionais e as escalas sempre podem; as outras precisam de resposta. */
export const isStepValid = (step: Step, answers: Answers) => step.optional === true || step.kind === 'scales' || isStepAnswered(step, answers)

/** Faixas de idade de menores (para avisos de privacidade e filtros de segurança). */
export const isMinorAge = (age: string) => /crian|adolesc/i.test(age)

/** Índices das perguntas que vieram respondidas (ex.: relação e ocasião de um guia). */
export const prefilledSteps = (answers: Answers) =>
  STEPS.flatMap((step, i) => (step.kind !== 'name' && step.kind !== 'scales' && isStepAnswered(step, answers) ? [i] : []))
