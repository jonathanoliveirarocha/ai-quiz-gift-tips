// Links de busca sem afiliado, usados só no HTML pré-renderizado (antes do JavaScript carregar).
// No navegador eles são trocados pelos links de afiliado montados no backend (única fonte das tags).
import type { StoreLink } from '../types.ts'

const enc = encodeURIComponent

const BUILDERS: Record<string, { name: string; build: (q: string) => string }> = {
  Amazon: { name: 'Amazon', build: (q) => `https://www.amazon.com.br/s?k=${enc(q)}` },
  Shopee: { name: 'Shopee', build: (q) => `https://shopee.com.br/search?keyword=${enc(q)}` },
  'Mercado Livre': { name: 'Mercado Livre', build: (q) => `https://lista.mercadolivre.com.br/${enc(q.trim().toLowerCase().replace(/\s+/g, '-'))}` },
}

const ID: Record<string, string> = { Amazon: 'amazon', Shopee: 'shopee', 'Mercado Livre': 'mercadolivre' }

export function plainStoreLinks(query: string, storeNames: string[]): StoreLink[] {
  return storeNames
    .filter((n) => BUILDERS[n])
    .map((n) => ({ store: ID[n], name: BUILDERS[n].name, url: BUILDERS[n].build(query), affiliate: false }))
}
