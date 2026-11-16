import { guideLink } from './content/guides/registry.ts'

export const normalizePath = (path: string) => path.replace(/\/+$/, '') || '/'

export const resultIdFromPath = (path: string) => normalizePath(path).match(/^\/r\/([a-f\d]{24})$/i)?.[1] ?? null

/**
 * Qual tela uma URL mostra ao abrir. O build grava isso no #root (data-route) e o navegador só
 * reaproveita o HTML pronto quando bate com a URL atual; se não bater, renderiza do zero.
 */
export function routeKey(path: string) {
  if (resultIdFromPath(path)) return 'result'
  const clean = normalizePath(path)
  if (clean === '/') return 'home'
  return guideLink(clean.slice(1)) ? `guide:${clean.slice(1)}` : 'notfound'
}
