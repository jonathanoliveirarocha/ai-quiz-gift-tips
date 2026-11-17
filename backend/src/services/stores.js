import { config } from '../config.js';

const enc = encodeURIComponent;
const slug = (q) => enc(q.trim().toLowerCase().replace(/\s+/g, '-'));

// Lojas conhecidas. Os links são montados aqui, nunca vindos da IA,
// então todo botão aponta para um domínio confiável e conhecido.
export const STORES = {
  amazon: { name: 'Amazon', build: (q) => `https://www.amazon.com.br/s?k=${enc(q)}` },
  shopee: { name: 'Shopee', build: (q) => `https://shopee.com.br/search?keyword=${enc(q)}` },
  mercadolivre: { name: 'Mercado Livre', build: (q) => `https://lista.mercadolivre.com.br/${slug(q)}` },
  magalu: { name: 'Magalu', build: (q) => `https://www.magazineluiza.com.br/busca/${enc(q)}/` },
  americanas: { name: 'Americanas', build: (q) => `https://www.americanas.com.br/s?q=${enc(q)}` },
  kabum: { name: 'KaBuM!', build: (q) => `https://www.kabum.com.br/busca/${slug(q)}` },
};

export const STORE_IDS = Object.keys(STORES);

const DEFAULT_ACTIVE = ['amazon', 'shopee'];
const unknown = config.activeStores.filter((id) => !STORES[id]);
if (unknown.length) console.warn(`[lojas] Ignorando lojas desconhecidas em ACTIVE_STORES: ${unknown.join(', ')}`);
const configured = [...new Set(config.activeStores.filter((id) => STORES[id]))];

/** Lojas que aparecem como botão em toda sugestão (ACTIVE_STORES; padrão: Amazon e Shopee). */
export const ACTIVE_STORE_IDS = configured.length ? configured : DEFAULT_ACTIVE;
export const ACTIVE_STORE_NAMES = ACTIVE_STORE_IDS.map((id) => STORES[id].name);

/** Tag da Amazon para o canal de origem (AMAZON_TRACKING_IDS), ou a tag padrão. */
export const amazonTagFor = (channel) => config.amazonTagsByChannel[channel] ?? config.amazonTag;

export function buildStoreLink(storeId, query, channel = 'direto') {
  const store = STORES[storeId];
  let url = store.build(query);
  let affiliate = false;

  const amazonTag = storeId === 'amazon' ? amazonTagFor(channel) : '';
  if (amazonTag) {
    url += `&tag=${enc(amazonTag)}`;
    affiliate = true;
  }

  const template = config.affiliateTemplate(storeId);
  if (template) {
    url = template.replaceAll('{url}', enc(url)).replaceAll('{query}', enc(query)).replaceAll('{canal}', enc(channel));
    affiliate = true;
  }

  return { store: storeId, name: store.name, url, affiliate };
}

/** Botões de todas as lojas ativas para um termo de busca, sempre na mesma ordem. */
export const buildStoreLinks = (query, channel = 'direto') => ACTIVE_STORE_IDS.map((id) => buildStoreLink(id, query, channel));

/** Problemas de configuração que zeram comissão sem nenhum erro visível (mostrados no painel e no log). */
export function affiliateWarnings() {
  const warnings = [];
  if (ACTIVE_STORE_IDS.includes('amazon') && !config.amazonTag) warnings.push('AMAZON_ASSOCIATE_TAG vazia: os botões da Amazon não geram comissão.');
  if (ACTIVE_STORE_IDS.includes('shopee') && !config.affiliateTemplate('shopee') && !(config.shopeeAppId && config.shopeeSecret)) {
    warnings.push('Shopee sem SHOPEE_APP_ID/SHOPEE_APP_SECRET nem AFFILIATE_TEMPLATE_SHOPEE: os botões da Shopee não geram comissão.');
  }
  for (const id of ACTIVE_STORE_IDS) {
    if (id !== 'amazon' && id !== 'shopee' && !config.affiliateTemplate(id)) warnings.push(`${STORES[id].name} ativa sem AFFILIATE_TEMPLATE_${id.toUpperCase()}: botão sem comissão.`);
  }
  return warnings;
}
