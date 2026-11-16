import { Product } from '../models.js';
import { isDbReady } from '../db.js';
import { STORES } from './stores.js';

export const normalizeTag = (value) =>
  typeof value === 'string'
    ? value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim().slice(0, 40)
    : '';

export const serializeProduct = (p) => ({
  id: String(p._id),
  title: p.title,
  description: p.description,
  imageUrl: p.imageUrl,
  price: p.price,
  store: p.store,
  storeName: STORES[p.store]?.name ?? p.store,
  url: p.url,
});

// Busca no catálogo de produtos parceiros (links de afiliado) os que combinam com o resultado.
export async function matchCatalog(result, answers, limit = 4) {
  if (!isDbReady()) return [];

  const words = [
    ...result.tags,
    ...answers.interests,
    ...answers.personality,
    result.idealGift.category,
    ...result.suggestions.map((s) => s.category),
  ]
    .flatMap((w) => normalizeTag(w).split(/[\s/,]+/))
    .filter((w) => w.length > 2);
  const tags = [...new Set(words)];
  if (!tags.length) return [];

  const filter = { active: true, tags: { $in: tags } };
  if (answers.budget.max !== null) filter.price = { $lte: Math.round(answers.budget.max * 1.1) };

  const candidates = await Product.find(filter).limit(60).lean();
  return candidates
    .map((p) => ({ p, score: p.tags.filter((t) => tags.includes(t)).length * (p.priority || 1) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ p }) => serializeProduct(p));
}
