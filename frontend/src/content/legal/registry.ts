import type { LegalPage } from './types.ts'

/** Lista leve das páginas institucionais (links do rodapé). O texto só é baixado na própria página. */
export const LEGAL_LINKS = [
  { slug: 'quem-somos', label: 'Quem somos', file: 'sobre' },
  { slug: 'politica-de-privacidade', label: 'Política de Privacidade', file: 'privacidade' },
  { slug: 'termos-de-uso', label: 'Termos de Uso', file: 'termos' },
] as const

const BY_SLUG = new Map<string, (typeof LEGAL_LINKS)[number]>(LEGAL_LINKS.map((l) => [l.slug, l]))
export const legalLink = (slug: string) => BY_SLUG.get(slug)

const loaders = import.meta.glob<LegalPage>(['./sobre.ts', './privacidade.ts', './termos.ts'], { import: 'default' })
const loaded = new Map<string, LegalPage>()

export const legalBySlug = (slug: string) => loaded.get(slug)

export function registerLegalPages(pages: LegalPage[]) {
  for (const p of pages) loaded.set(p.slug, p)
}

export async function loadLegal(slug: string) {
  const link = BY_SLUG.get(slug)
  if (!link || loaded.has(slug)) return loaded.get(slug)
  const loader = loaders[`./${link.file}.ts`]
  if (!loader) return undefined
  const page = await loader()
  loaded.set(slug, page)
  return page
}
