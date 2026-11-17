import { buildStoreLinks } from './stores.js';
import { normalizeTag } from './catalog.js';
import { isMinorAge } from './answers.js';

const str = (value, max, fallback = '') => (typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : fallback);
const price = (value) => (Number.isFinite(Number(value)) && Number(value) > 0 ? Math.round(Number(value)) : null);
const KINDS = ['produto', 'experiencia', 'personalizado', 'assinatura'];

const plain = (text) =>
  String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

// ---------- Moderação: o texto gerado nunca sai com ofensas, mesmo se alguém tentar manipular a IA ----------
const OFFENSIVE =
  /\b(porra|caralh\w*|merda\w*|puta\w*|put[ao]s?|fod[aeiu]\w*|fdp|vtnc|arrombad\w*|cuzao|buceta|piroca|viad[oa]s?|vagabund\w*|vadia\w*|piranha\w*|corn[oa]s?|otari[oa]s?|imbecil\w*|retardad\w*|escrot\w*|babaca\w*|desgracad\w*|nazis\w*)\b/;
export const isOffensive = (text) => OFFENSIVE.test(plain(text));

// ---------- Segurança: o que nunca vai para menores de idade ----------
const ADULT_ONLY =
  /\b(vinhos?|cervej\w*|whisk\w*|vodka|gin|cachac\w*|licor\w*|drinks?|destilad\w*|alcool\w*|tabaco|cigarr\w*|charut\w*|narguil\w*|vape|facas?|canivete\w*|punha\w*|armas?|airsoft|paintball|lingerie|sensual|erotic\w*|sexy|aposta\w*)\b/;
const ALCOHOL = /\b(vinhos?|cervej\w*|whisk\w*|vodka|gin|cachac\w*|licor\w*|drinks?|destilad\w*|alcool\w*|espumante\w*|champanhe)\b/;

// Palavras do campo "o que evitar" que não dizem o que evitar.
const STOPWORDS = new Set(
  'alergia alergico alergica tem tenho ja nao gosta gosto gostam odeia odeio usa usar bebe come curte quer queria prefere nunca nada muito mais menos tambem porque pois mas para pela pelo com sem uma umas uns dos das nos nas que ela ele elas eles essa esse isso aquela aquele dela dele coisa coisas tipo tipos cor cores ganhou ganhar presente presentes'.split(
    ' ',
  ),
);

/** Palavras significativas do "o que evitar" (ex.: "já tem Kindle, odeia rosa" -> kindle, rosa). */
export function avoidKeywords(avoid) {
  return [
    ...new Set(
      plain(avoid)
        .split(/[^a-z0-9]+/)
        .map((w) => w.replace(/s$/, ''))
        .filter((w) => w.length >= 4 && !STOPWORDS.has(w)),
    ),
  ];
}

function isBlocked(item, { minor, keywords, noAlcohol }) {
  const haystack = plain(`${item.title} ${item.query} ${item.category}`);
  if (minor && ADULT_ONLY.test(haystack)) return true;
  if (noAlcohol && ALCOHOL.test(haystack)) return true;
  const words = haystack.split(/[^a-z0-9]+/).map((w) => w.replace(/s$/, ''));
  return keywords.some((k) => words.some((w) => w.startsWith(k)));
}

function normalizeItem(item, channel) {
  const title = str(item?.title, 120, 'Presente surpresa');
  const query = str(item?.query, 80, title);
  let priceMin = price(item?.priceMin);
  let priceMax = price(item?.priceMax);
  if (priceMin && priceMax && priceMin > priceMax) [priceMin, priceMax] = [priceMax, priceMin];

  return {
    title,
    description: str(item?.description, 400),
    why: str(item?.why, 600),
    emoji: str(item?.emoji, 8, '🎁'),
    category: str(item?.category, 40, 'Presente'),
    kind: KINDS.includes(item?.kind) ? item.kind : 'produto',
    priceMin,
    priceMax,
    query,
    stores: buildStoreLinks(query, channel),
  };
}

const fitsBudget = (budget) => (item) =>
  !budget ||
  ((item.priceMax === null || item.priceMax >= budget.min * 0.6) &&
    (budget.max === null || item.priceMin === null || item.priceMin <= budget.max * 1.1));

const itemIsClean = (item) => !isOffensive(`${item.title} ${item.description} ${item.why} ${item.category}`);

/**
 * Garante formato, limites, segurança e links, venha o resultado da IA ou do acervo.
 * Devolve null se nenhum presente sobrar depois dos filtros (quem chama usa o acervo).
 */
export function normalizeResult(raw, answers, channel = 'direto') {
  const budget = answers?.budget;
  const rules = {
    minor: isMinorAge(answers?.age),
    keywords: avoidKeywords(answers?.avoid),
    noAlcohol: /alcool|nao bebe|bebida/.test(plain(answers?.avoid)),
  };
  const fits = fitsBudget(budget);

  const all = [raw?.idealGift, ...(Array.isArray(raw?.suggestions) ? raw.suggestions : [])]
    .filter(Boolean)
    .map((item) => normalizeItem(item, channel));
  const seen = new Set();
  const safe = all.filter((item) => {
    const key = normalizeTag(item.title);
    if (seen.has(key) || isBlocked(item, rules) || !itemIsClean(item)) return false;
    seen.add(key);
    return true;
  });
  if (!safe.length) return null;

  // O presente ideal é o primeiro que cabe no orçamento (normalmente o que a IA escolheu).
  const idealIndex = Math.max(0, safe.findIndex(fits));
  const ideal = safe[idealIndex];
  const others = safe.filter((_, i) => i !== idealIndex);
  const inBudget = others.filter(fits);
  const suggestions = (inBudget.length >= 3 ? inBudget : others).slice(0, 6);

  const clean = (text, max, fallback = '') => {
    const value = str(text, max, fallback);
    return isOffensive(value) ? fallback : value;
  };

  return {
    profile: {
      archetype: clean(raw?.profile?.archetype, 80, 'Uma pessoa única'),
      summary: clean(raw?.profile?.summary, 400),
      emoji: str(raw?.profile?.emoji, 8, '✨'),
    },
    idealGift: ideal,
    suggestions,
    cardMessage: clean(raw?.cardMessage, 400, 'Escolhi este presente pensando em você e em tudo que te faz feliz. Que ele traga muitos momentos bons!'),
    deliveryTip: clean(raw?.deliveryTip, 400),
    avoid: (Array.isArray(raw?.avoid) ? raw.avoid : [])
      .map((a) => clean(a, 80))
      .filter(Boolean)
      .slice(0, 4),
    tags: [...new Set((Array.isArray(raw?.tags) ? raw.tags : []).map(normalizeTag).filter(Boolean))].slice(0, 12),
  };
}

const relink = (item, channel) =>
  item ? { ...item, stores: buildStoreLinks(str(item.query, 80, str(item.title, 120, 'presente')), channel) } : item;

/**
 * Remonta os botões das lojas de um resultado já salvo, para quem está vendo agora. Assim os links
 * seguem as lojas ativas, as tags de afiliado atuais e o canal de quem clicou.
 */
export function withStoreLinks(result, channel = 'direto') {
  if (!result) return result;
  const { confidence: _ignored, ...idealGift } = result.idealGift ?? {};
  return {
    ...result,
    idealGift: relink(idealGift, channel),
    suggestions: (result.suggestions ?? []).map((s) => relink(s, channel)),
  };
}
