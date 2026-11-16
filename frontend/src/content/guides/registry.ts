import type { Guide } from '../types.ts'

export type GuideLink = { slug: string; label: string; emoji: string }

/**
 * Lista leve dos guias, enviada em todas as páginas (links da home, do rodapé e dos relacionados).
 * O texto completo de cada guia fica em um arquivo separado e só é baixado na página daquele guia.
 * Precisa bater com index.ts: o build confere slug, label, emoji e ordem (scripts/prerender.mjs).
 */
export const GUIDE_LINKS: GuideLink[] = [
  { slug: 'presente-para-mae', label: 'Presente para mãe', emoji: '💐' },
  { slug: 'presente-para-pai', label: 'Presente para pai', emoji: '👔' },
  { slug: 'presente-para-namorado', label: 'Presente para namorado', emoji: '💌' },
  { slug: 'presente-para-namorada', label: 'Presente para namorada', emoji: '💞' },
  { slug: 'presente-para-amiga', label: 'Presente para amiga', emoji: '🌻' },
  { slug: 'presente-para-amigo', label: 'Presente para amigo', emoji: '🤝' },
  { slug: 'presente-para-avo', label: 'Presente para avó e avô', emoji: '👵' },
  { slug: 'presente-para-crianca', label: 'Presente para criança', emoji: '🧸' },
  { slug: 'presente-para-adolescente', label: 'Presente para adolescente', emoji: '🎧' },
  { slug: 'presente-para-colega-de-trabalho', label: 'Presente para colega de trabalho', emoji: '💼' },
  { slug: 'presente-amigo-secreto', label: 'Presente de amigo secreto', emoji: '🤫' },
  { slug: 'presente-de-natal', label: 'Presente de Natal', emoji: '🎄' },
  { slug: 'presente-de-aniversario', label: 'Presente de aniversário', emoji: '🎂' },
  { slug: 'presente-ate-50-reais', label: 'Presente até 50 reais', emoji: '🪙' },
  { slug: 'presente-criativo', label: 'Presente criativo', emoji: '💡' },
  { slug: 'presente-para-quem-tem-tudo', label: 'Presente para quem tem tudo', emoji: '🎟️' },
]

const LINKS_BY_SLUG = new Map(GUIDE_LINKS.map((l) => [l.slug, l]))

export const guideLink = (slug: string) => LINKS_BY_SLUG.get(slug)

// Cada guia vira um arquivo JavaScript próprio no build.
const loaders = import.meta.glob<Guide>('./presente-*.ts', { import: 'default' })
const loaded = new Map<string, Guide>()

/** Guia já carregado (no servidor, todos; no navegador, o da página atual). */
export const guideBySlug = (slug: string) => loaded.get(slug)

/** Usado pelo build para deixar todos os guias disponíveis na renderização. */
export function registerGuides(guides: Guide[]) {
  for (const g of guides) loaded.set(g.slug, g)
}

/** Baixa o texto de um guia, se o slug for de um guia. */
export async function loadGuide(slug: string) {
  const cached = loaded.get(slug)
  if (cached || !LINKS_BY_SLUG.has(slug)) return cached
  const loader = loaders[`./${slug}.ts`]
  if (!loader) return undefined
  const guide = await loader()
  loaded.set(slug, guide)
  return guide
}
