import type { Answers, ClickKind, QuizResponse } from './types.ts'

// Endereço do backend, definido em frontend/.env (VITE_API_URL).
const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')
const endpoint = (path: string) => `${API_URL}/api${path}`

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(endpoint(path), { headers: { 'Content-Type': 'application/json' }, ...init })
  } catch {
    throw new Error('Não foi possível falar com o servidor. Confira se o backend está rodando e o VITE_API_URL.')
  }
  const data = await response.json().catch(() => null)
  if (!response.ok) throw new Error(data?.error ?? `Erro ${response.status}. Tente de novo.`)
  return data as T
}

export const generateGift = (answers: Answers, exclude: string[] = []) =>
  request<QuizResponse>('/quiz', { method: 'POST', body: JSON.stringify({ answers, exclude }) })

export const getResult = (id: string) => request<QuizResponse>(`/results/${id}`)

// text/plain não dispara preflight de CORS, então o beacon chega mesmo saindo da página.
export function trackClick(click: { resultId: string | null; title: string; store: string; url: string; kind: ClickKind }) {
  const body = JSON.stringify(click)
  if (!navigator.sendBeacon?.(endpoint('/clicks'), new Blob([body], { type: 'text/plain' }))) {
    fetch(endpoint('/clicks'), { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(() => {})
  }
}
