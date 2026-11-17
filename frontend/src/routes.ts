import { guideLink } from './content/guides/registry.ts'
import { legalLink } from './content/legal/registry.ts'

export const normalizePath = (path: string) => path.replace(/\/+$/, '') || '/'

// Resultado: código público aleatório (22 caracteres) ou o formato antigo (24 hexadecimais).
export const resultIdFromPath = (path: string) => normalizePath(path).match(/^\/r\/([A-Za-z0-9_-]{22}|[a-f\d]{24})$/i)?.[1] ?? null

/** Páginas que só existem no navegador (sem conteúdo para o Google). */
export const APP_PAGES = { painel: 'Painel' } as const
export type AppPage = keyof typeof APP_PAGES

export const appPageFromPath = (path: string): AppPage | null => {
  const slug = normalizePath(path).slice(1)
  return slug in APP_PAGES ? (slug as AppPage) : null
}

/**
 * Qual tela uma URL mostra ao abrir. O build grava isso no #root (data-route) e o navegador só
 * reaproveita o HTML pronto quando bate com a URL atual; se não bater, renderiza do zero.
 */
export function routeKey(path: string) {
  if (resultIdFromPath(path)) return 'result'
  const clean = normalizePath(path)
  if (clean === '/') return 'home'
  const slug = clean.slice(1)
  if (guideLink(slug)) return `guide:${slug}`
  if (legalLink(slug)) return `legal:${slug}`
  if (appPageFromPath(clean)) return `app:${slug}`
  return 'notfound'
}
