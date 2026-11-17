// API oficial de afiliados da Shopee (opcional). Com SHOPEE_APP_ID e SHOPEE_APP_SECRET, cada sugestão
// ganha um produto real da Shopee: foto, preço e link oficial de afiliado. Sem credenciais, ou se a API
// falhar, o site continua com os links de busca normalmente.
// Formato da API (GraphQL + assinatura SHA256): https://open-api.affiliate.shopee.com.br/explorer
import crypto from 'node:crypto';
import { config } from '../config.js';
import { isDbReady } from '../db.js';
import { ShopeeCache } from '../models.js';
import { alert } from './ops.js';

const CACHE_MS = 12 * 60 * 60 * 1000;
const TIMEOUT_MS = 4000;
const SHOPEE_HOST = /^https:\/\/([a-z0-9-]+\.)*(shopee\.com\.br|shope\.ee|susercontent\.com|shopee\.ee)\//i;

export const shopeeApiEnabled = () => Boolean(config.shopeeAppId && config.shopeeSecret);

let pausedUntil = 0;
const memoryCache = new Map();

const key = (query) =>
  query
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);

const num = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : null;
};

function parseNodes(nodes) {
  return (Array.isArray(nodes) ? nodes : [])
    .map((n) => ({
      name: String(n?.productName ?? '').slice(0, 140),
      imageUrl: String(n?.imageUrl ?? ''),
      price: num(n?.priceMin) ?? num(n?.price),
      url: String(n?.offerLink ?? ''),
      rating: num(n?.ratingStar),
      sales: Number.isFinite(Number(n?.sales)) ? Number(n.sales) : null,
    }))
    .filter((p) => p.name && p.price && SHOPEE_HOST.test(p.url) && SHOPEE_HOST.test(p.imageUrl));
}

async function callApi(keyword) {
  const query = `{ productOfferV2(keyword: ${JSON.stringify(keyword)}, sortType: 2, page: 1, limit: 10) { nodes { productName priceMin price imageUrl offerLink ratingStar sales } } }`;
  const payload = JSON.stringify({ query });
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto.createHash('sha256').update(`${config.shopeeAppId}${timestamp}${payload}${config.shopeeSecret}`).digest('hex');
  const res = await fetch(config.shopeeApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `SHA256 Credential=${config.shopeeAppId}, Timestamp=${timestamp}, Signature=${signature}`,
    },
    body: payload,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || data?.errors?.length) {
    throw new Error(`Shopee API ${res.status}: ${data?.errors?.[0]?.message ?? 'resposta inválida'}`);
  }
  return parseNodes(data?.data?.productOfferV2?.nodes);
}

async function productsFor(query) {
  const id = key(query);
  if (!id) return [];
  const cached = memoryCache.get(id);
  if (cached && cached.expiresAt > Date.now()) return cached.items;
  if (isDbReady()) {
    const doc = await ShopeeCache.findById(id).lean().catch(() => null);
    if (doc && doc.expiresAt > new Date()) {
      memoryCache.set(id, { items: doc.items, expiresAt: doc.expiresAt.getTime() });
      return doc.items;
    }
  }
  const items = await callApi(query);
  const expiresAt = Date.now() + CACHE_MS;
  memoryCache.set(id, { items, expiresAt });
  if (memoryCache.size > 2000) memoryCache.clear();
  if (isDbReady()) {
    await ShopeeCache.updateOne({ _id: id }, { items, expiresAt: new Date(expiresAt) }, { upsert: true }).catch(() => {});
  }
  return items;
}

/** Escolhe o produto mais vendido cujo preço combina com a estimativa (ou com o orçamento). */
function pick(items, hint) {
  if (!items.length) return null;
  const min = hint?.min ?? null;
  const max = hint?.max ?? null;
  const inRange = (p) => (min === null || p.price >= min * 0.5) && (max === null || p.price <= max * 1.3);
  return items.find(inRange) ?? (min === null && max === null ? items[0] : null);
}

/**
 * Para cada pedido { query, min, max }, devolve o produto da Shopee escolhido (ou null).
 * Nunca lança erro: se a API falhar, fica 10 minutos em pausa e o site usa os links de busca.
 */
export async function findShopeeProducts(requests) {
  if (!shopeeApiEnabled() || Date.now() < pausedUntil) return requests.map(() => null);
  const unique = [...new Set(requests.map((r) => r.query))];
  const found = new Map();
  try {
    await Promise.all(unique.map(async (q) => found.set(q, await productsFor(q))));
  } catch (err) {
    pausedUntil = Date.now() + 10 * 60 * 1000;
    console.error('[shopee]', err.message);
    alert('shopee-api', `API da Shopee falhou (${err.message}). Os botões da Shopee voltaram aos links de busca por 10 minutos.`);
  }
  return requests.map((r) => pick(found.get(r.query) ?? [], r));
}
