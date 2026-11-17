// Segurança e promessas do resultado: menores, "o que evitar", ofensas, orçamento e privacidade.
import { test } from 'node:test';
import assert from 'node:assert/strict';

process.env.ACTIVE_STORES = 'amazon,shopee';
process.env.GEMINI_API_KEY = 'chave-de-teste';
process.env.MAX_AI_CALLS_PER_DAY = '0';

const { normalizeResult, avoidKeywords, isOffensive, withStoreLinks } = await import('../src/services/result.js');
const { parseAnswers, storableAnswers, describeAnswers } = await import('../src/services/answers.js');
const { generateGifts } = await import('../src/services/generate.js');
const { cleanChannel } = await import('../src/services/security.js');

const item = (title, priceMin, priceMax, extra = {}) => ({
  title,
  description: `Sobre ${title}`,
  why: 'Combina com o jeito da pessoa.',
  emoji: '🎁',
  category: 'Presente',
  kind: 'produto',
  priceMin,
  priceMax,
  query: title.toLowerCase(),
  ...extra,
});

const base = {
  relationship: 'Mãe',
  occasion: 'Natal',
  age: '36 a 50 anos',
  avoid: '',
  budget: { label: 'R$ 100 a R$ 200', min: 100, max: 200 },
};

test('menor de idade nunca recebe bebida alcoólica nem faca', () => {
  const raw = {
    idealGift: item('Kit de vinhos', 120, 180),
    suggestions: [item('Faca do chef', 100, 150), item('Jogo de tabuleiro', 120, 180), item('Fone de ouvido', 100, 190)],
  };
  const result = normalizeResult(raw, { ...base, age: 'Adolescente (13 a 17 anos)' });
  const titles = [result.idealGift.title, ...result.suggestions.map((s) => s.title)];
  assert.deepEqual(titles, ['Jogo de tabuleiro', 'Fone de ouvido']);
});

test('respeita o que a pessoa já tem ou não gosta', () => {
  assert.deepEqual(avoidKeywords('Já tem Kindle, não gosta de rosa e tem alergia a amendoim'), ['kindle', 'rosa', 'amendoim']);
  const raw = {
    idealGift: item('Kindle Paperwhite', 150, 200),
    suggestions: [item('Caneca rosa', 100, 120), item('Pasta de amendoim artesanal', 100, 130), item('Luminária de leitura', 100, 150)],
  };
  const result = normalizeResult(raw, { ...base, avoid: 'Já tem Kindle, não gosta de rosa e tem alergia a amendoim' });
  assert.equal(result.idealGift.title, 'Luminária de leitura');
  assert.equal(result.suggestions.length, 0);
});

test('"não bebe álcool" remove bebidas mesmo sem citar o nome da bebida', () => {
  const raw = { idealGift: item('Kit de cervejas artesanais', 120, 180), suggestions: [item('Kit de chás', 100, 150)] };
  assert.equal(normalizeResult(raw, { ...base, avoid: 'não bebe álcool' }).idealGift.title, 'Kit de chás');
});

test('ofensas somem do texto e de itens', () => {
  assert.ok(isOffensive('Que presente de MERDA'));
  assert.ok(!isOffensive('Uma pelúcia macia para a coleção'));
  const raw = {
    profile: { archetype: 'Arrombado', summary: 'ok', emoji: '✨' },
    idealGift: item('Caneca', 100, 150),
    suggestions: [item('Livro', 100, 150, { why: 'porque você é um idiota babaca' })],
    cardMessage: 'porra, feliz natal',
  };
  const result = normalizeResult(raw, base);
  assert.equal(result.profile.archetype, 'Uma pessoa única');
  assert.equal(result.suggestions.length, 0);
  assert.doesNotMatch(result.cardMessage, /porra/i);
});

test('o presente ideal cabe no orçamento quando há opção que cabe', () => {
  const raw = { idealGift: item('Notebook', 3000, 4000), suggestions: [item('Mochila', 150, 190), item('Garrafa', 100, 130)] };
  assert.equal(normalizeResult(raw, base).idealGift.title, 'Mochila');
});

test('devolve null quando nada passa nos filtros', () => {
  assert.equal(normalizeResult({ idealGift: item('Kit de vinhos', 120, 180), suggestions: [] }, { ...base, age: 'Criança (6 a 12 anos)' }), null);
});

test('resultado salvo ganha os links das lojas atuais e perde o "% match"', () => {
  const old = { idealGift: { title: 'Moedor', query: 'moedor de cafe', confidence: 90, stores: [{ store: 'google' }] }, suggestions: [] };
  const fixed = withStoreLinks(old, 'direto');
  assert.equal(fixed.idealGift.confidence, undefined);
  assert.deepEqual(
    fixed.idealGift.stores.map((s) => s.store),
    ['amazon', 'shopee'],
  );
});

test('o nome nunca é aceito pelo servidor nem guardado; textos livres não são guardados', () => {
  const { answers } = parseAnswers({
    name: 'Ana',
    hasName: true,
    relationship: 'Mãe',
    occasion: 'Natal',
    budget: { label: 'R$ 100 a R$ 200', min: 100, max: 200 },
    avoid: 'alergia a lã',
    special: 'mora na rua X',
    otherInterest: 'crochê',
  });
  assert.equal(answers.name, undefined);
  assert.match(describeAnswers(answers), /\{nome\}/);
  assert.doesNotMatch(describeAnswers(answers), /Ana/);
  const stored = storableAnswers(answers);
  for (const key of ['name', 'avoid', 'special', 'otherInterest']) assert.equal(stored[key], undefined, key);
});

test('sem IA disponível (teto ou limite), o acervo responde e nunca deixa a visita sem presente', async () => {
  const { answers } = parseAnswers({
    hasName: true,
    relationship: 'Amigo ou amiga',
    occasion: 'Aniversário',
    age: 'Criança (6 a 12 anos)',
    interests: ['Games', 'Música'],
    budget: { label: 'R$ 100 a R$ 200', min: 100, max: 200 },
  });
  const { result, mode } = await generateGifts(answers, [], { allowAi: false });
  assert.equal(mode, 'acervo');
  assert.ok(result.idealGift.title);
  assert.ok(result.suggestions.length >= 3);
  assert.match(result.cardMessage, /\{nome\}/);
  const all = [result.idealGift, ...result.suggestions].map((i) => i.title.toLowerCase()).join(' ');
  assert.doesNotMatch(all, /vinho|cerveja/);
});

test('canal de origem é limpo', () => {
  assert.equal(cleanChannel('Instagram Stories!'), 'instagram-stories');
  assert.equal(cleanChannel(''), 'direto');
  assert.equal(cleanChannel('<script>'), 'script');
});
