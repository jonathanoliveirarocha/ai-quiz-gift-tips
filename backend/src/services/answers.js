// Valida as respostas do quiz e as transforma em texto para a IA.

const text = (value, max) => (typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : '');
const list = (value, maxItems, maxLen) =>
  Array.isArray(value) ? [...new Set(value.map((v) => text(v, maxLen)).filter(Boolean))].slice(0, maxItems) : [];
const scale = (value) => {
  const n = Math.round(Number(value));
  return n >= 1 && n <= 5 ? n : 3;
};
const money = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.min(Math.round(n), 1_000_000) : null;
};

export function parseAnswers(raw) {
  if (!raw || typeof raw !== 'object') return { error: 'Respostas do quiz ausentes.' };

  const budget = raw.budget ?? {};
  const answers = {
    name: text(raw.name, 40),
    pronoun: ['ela', 'ele', 'neutro'].includes(raw.pronoun) ? raw.pronoun : 'neutro',
    relationship: text(raw.relationship, 60),
    age: text(raw.age, 40),
    occasion: text(raw.occasion, 60),
    budget: { label: text(budget.label, 40), min: money(budget.min) ?? 0, max: money(budget.max) },
    personality: list(raw.personality, 6, 40),
    interests: list(raw.interests, 10, 40),
    otherInterest: text(raw.otherInterest, 120),
    perfectSaturday: text(raw.perfectSaturday, 80),
    style: {
      practicalSentimental: scale(raw.style?.practicalSentimental),
      classicBold: scale(raw.style?.classicBold),
      objectExperience: scale(raw.style?.objectExperience),
    },
    avoid: text(raw.avoid, 300),
    special: text(raw.special, 600),
  };

  if (!answers.relationship || !answers.occasion || !answers.budget.label) {
    return { error: 'Responda pelo menos a relação, a ocasião e o orçamento.' };
  }
  if (answers.budget.max !== null && answers.budget.max < answers.budget.min) answers.budget.max = answers.budget.min;
  return { answers };
}

export const parseExclude = (raw) => list(raw, 12, 100);

const scaleLabel = (value, left, right) => {
  if (value <= 2) return `mais ${left}`;
  if (value >= 4) return `mais ${right}`;
  return `equilíbrio entre ${left} e ${right}`;
};

export function describeAnswers(a) {
  const floor = Math.round(a.budget.min * 0.8);
  const budget =
    a.budget.max === null
      ? `acima de R$ ${a.budget.min} (cada presente deve custar a partir de R$ ${floor})`
      : `entre R$ ${a.budget.min} e R$ ${a.budget.max} (cada presente deve custar de R$ ${floor} a R$ ${a.budget.max})`;
  const pronoun = { ela: 'ela', ele: 'ele', neutro: 'neutro (não marcar gênero)' }[a.pronoun];
  const interests = [...a.interests, a.otherInterest].filter(Boolean).join(', ');

  return [
    `- Nome ou apelido: ${a.name || 'não informado'}`,
    `- Pronome: ${pronoun}`,
    `- Relação com quem presenteia: ${a.relationship}`,
    `- Faixa de idade: ${a.age || 'não informada'}`,
    `- Ocasião: ${a.occasion}`,
    `- Orçamento: ${budget}`,
    `- Personalidade: ${a.personality.join(', ') || 'não informada'}`,
    `- Interesses: ${interests || 'não informados'}`,
    `- Sábado perfeito: ${a.perfectSaturday || 'não informado'}`,
    `- Estilo do presente: ${scaleLabel(a.style.practicalSentimental, 'prático', 'sentimental')}; ${scaleLabel(a.style.classicBold, 'clássico', 'inusitado')}; ${scaleLabel(a.style.objectExperience, 'objeto', 'experiência')}`,
    `- Já tem ou não gosta (evitar): ${a.avoid || 'nada informado'}`,
    `- Detalhe especial: ${a.special || 'nenhum'}`,
  ].join('\n');
}
