import { config } from '../config.js';

const enc = encodeURIComponent;
const slug = (q) => enc(q.trim().toLowerCase().replace(/\s+/g, '-'));

// Lojas permitidas. Os links são montados aqui, nunca vindos da IA,
// então todo card aponta para um domínio confiável e conhecido.
export const STORES = {
  amazon: { name: 'Amazon', build: (q) => `https://www.amazon.com.br/s?k=${enc(q)}` },
  mercadolivre: { name: 'Mercado Livre', build: (q) => `https://lista.mercadolivre.com.br/${slug(q)}` },
  magalu: { name: 'Magalu', build: (q) => `https://www.magazineluiza.com.br/busca/${enc(q)}/` },
  americanas: { name: 'Americanas', build: (q) => `https://www.americanas.com.br/s?q=${enc(q)}` },
  shopee: { name: 'Shopee', build: (q) => `https://shopee.com.br/search?keyword=${enc(q)}` },
  kabum: { name: 'KaBuM!', build: (q) => `https://www.kabum.com.br/busca/${slug(q)}` },
  google_shopping: { name: 'Comparar preços', build: (q) => `https://www.google.com/search?tbm=shop&q=${enc(q)}` },
  google: { name: 'Pesquisar', build: (q) => `https://www.google.com/search?q=${enc(q)}` },
};

export const STORE_IDS = Object.keys(STORES);
const DEFAULT_STORES = ['amazon', 'mercadolivre', 'google_shopping'];

export function buildStoreLink(storeId, query) {
  const store = STORES[storeId];
  let url = store.build(query);
  let affiliate = false;

  if (storeId === 'amazon' && config.amazonTag) {
    url += `&tag=${enc(config.amazonTag)}`;
    affiliate = true;
  }

  const template = config.affiliateTemplate(storeId);
  if (template) {
    url = template.replaceAll('{url}', enc(url)).replaceAll('{query}', enc(query));
    affiliate = true;
  }

  return { store: storeId, name: store.name, url, affiliate };
}

export function buildStoreLinks(storeIds, query) {
  const valid = [...new Set((storeIds ?? []).filter((id) => STORES[id]))];
  const ids = valid.length ? valid : DEFAULT_STORES;
  return ids.slice(0, 4).map((id) => buildStoreLink(id, query));
}
