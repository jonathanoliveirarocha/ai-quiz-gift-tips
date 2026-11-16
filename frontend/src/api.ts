import type { Answers, ClickKind, Health, QuizResponse } from './types.ts'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...init })
  } catch {
    throw new Error('Não foi possível falar com o servidor. Confira se o backend está rodando.')
  }
  const data = await response.json().catch(() => null)
  if (!response.ok) throw new Error(data?.error ?? `Erro ${response.status}. Tente de novo.`)
  return data as T
}

export const generateGift = (answers: Answers, exclude: string[] = []) =>
  request<QuizResponse>('/api/quiz', { method: 'POST', body: JSON.stringify({ answers, exclude }) })

export const getResult = (id: string) => request<QuizResponse>(`/api/results/${id}`)

export const getHealth = () => request<Health>('/api/health')

export function trackClick(click: { resultId: string | null; title: string; store: string; url: string; kind: ClickKind }) {
  const body = new Blob([JSON.stringify(click)], { type: 'application/json' })
  if (!navigator.sendBeacon?.('/api/clicks', body)) {
    fetch('/api/clicks', { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(() => {})
  }
}
