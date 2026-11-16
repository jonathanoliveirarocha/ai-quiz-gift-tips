import { buildStoreLinks } from './stores.js';
import { normalizeTag } from './catalog.js';

const str = (value, max, fallback = '') => (typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : fallback);
const price = (value) => (Number.isFinite(Number(value)) && Number(value) > 0 ? Math.round(Number(value)) : null);
const KINDS = ['produto', 'experiencia', 'personalizado', 'assinatura'];

function normalizeItem(item) {
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
    stores: buildStoreLinks(item?.stores, query),
  };
}

// Descarta sugestões claramente fora do orçamento, desde que sobrem pelo menos 3.
function withinBudget(items, budget) {
  const fits = (item) =>
    (item.priceMax === null || item.priceMax >= budget.min * 0.6) &&
    (budget.max === null || item.priceMin === null || item.priceMin <= budget.max * 1.1);
  const filtered = items.filter(fits);
  return filtered.length >= 3 ? filtered : items;
}

// Garante formato, limites e links seguros, venha o resultado da IA ou do modo demonstração.
export function normalizeResult(raw, budget) {
  const confidence = Math.round(Number(raw?.idealGift?.confidence));
  const suggestions = (Array.isArray(raw?.suggestions) ? raw.suggestions : []).slice(0, 6).map(normalizeItem);
  return {
    profile: {
      archetype: str(raw?.profile?.archetype, 80, 'Uma pessoa única'),
      summary: str(raw?.profile?.summary, 400),
      emoji: str(raw?.profile?.emoji, 8, '✨'),
    },
    idealGift: {
      ...normalizeItem(raw?.idealGift),
      confidence: confidence >= 1 && confidence <= 100 ? confidence : 90,
    },
    suggestions: budget ? withinBudget(suggestions, budget) : suggestions,
    cardMessage: str(raw?.cardMessage, 400),
    deliveryTip: str(raw?.deliveryTip, 400),
    avoid: (Array.isArray(raw?.avoid) ? raw.avoid : []).map((a) => str(a, 80)).filter(Boolean).slice(0, 4),
    tags: [...new Set((Array.isArray(raw?.tags) ? raw.tags : []).map(normalizeTag).filter(Boolean))].slice(0, 12),
  };
}
