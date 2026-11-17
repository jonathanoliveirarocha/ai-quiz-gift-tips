import type { Answers, ClickKind, QuizResponse, StoreLinksItem } from './types.ts'
import { getChannel } from './lib/tracking.ts'
import { getTurnstileToken } from './lib/turnstile.ts'

// Endereço do backend, definido em frontend/.env (VITE_API_URL).
const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')
const endpoint = (path: string) => `${API_URL}/api${path}`

const OFFLINE = 'Não conseguimos falar com o site agora. Confira sua internet e tente de novo em instantes.'
const SLOW = 'Está demorando mais que o normal. Tente de novo em instantes.'

async function request<T>(path: string, init: RequestInit & { timeoutMs?: number } = {}): Promise<T> {
  const { timeoutMs = 20000, headers, ...rest } = init
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)
  let response: Response
  try {
    response = await fetch(endpoint(path), { headers: { 'Content-Type': 'application/json', ...headers }, signal: controller.signal, ...rest })
  } catch (err) {
    throw new Error((err as Error).name === 'AbortError' ? SLOW : OFFLINE)
  } finally {
    window.clearTimeout(timer)
  }
  if (response.status === 204) return undefined as T
  const data = await response.json().catch(() => null)
  if (!response.ok) throw Object.assign(new Error(data?.error ?? 'Algo deu errado. Tente de novo em instantes.'), { status: response.status })
  return data as T
}

/** Envia as respostas sem o nome: ele fica no navegador e a IA usa o marcador {nome}. */
export async function generateGift(answers: Answers, options: { exclude?: string[]; parentId?: string | null } = {}) {
  const { name, ...rest } = answers
  const turnstileToken = await getTurnstileToken()
  return request<QuizResponse>('/quiz', {
    method: 'POST',
    timeoutMs: 60000,
    body: JSON.stringify({
      answers: { ...rest, hasName: Boolean(name.trim()) },
      exclude: options.exclude ?? [],
      parentId: options.parentId ?? undefined,
      channel: getChannel(),
      turnstileToken,
    }),
  })
}

export const getResult = (id: string) => request<QuizResponse>(`/results/${encodeURIComponent(id)}?canal=${getChannel()}`)

export const reportResult = (id: string) => request<void>(`/results/${encodeURIComponent(id)}/report`, { method: 'POST', body: '{}' })

/** Links de afiliado (e produto real da Shopee, quando disponível) para uma lista de termos de busca. */
export async function getStoreLinks(items: { query: string; min?: number | null; max?: number | null }[]) {
  const data = await request<{ items: StoreLinksItem[] }>('/links', {
    method: 'POST',
    timeoutMs: 8000,
    body: JSON.stringify({ items, channel: getChannel() }),
  })
  return data.items
}

// text/plain não dispara preflight de CORS, então o beacon chega mesmo saindo da página.
export function trackClick(click: { resultId: string | null; title: string; store: string; url: string; kind: ClickKind; page?: string }) {
  const body = JSON.stringify({ ...click, channel: getChannel(), page: click.page ?? window.location.pathname.replace(/^\/r\/.+/, '/r/[id]') })
  try {
    if (navigator.sendBeacon?.(endpoint('/clicks'), new Blob([body], { type: 'text/plain' }))) return
  } catch {
    // segue para o fetch
  }
  fetch(endpoint('/clicks'), { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(() => {})
}
