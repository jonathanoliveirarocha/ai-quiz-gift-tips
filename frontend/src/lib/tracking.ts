// Origem da visita (canal) e eventos anônimos do funil. Sem cookies: o código da sessão vive no
// sessionStorage e some ao fechar a aba.
import { readSession, writeSession } from './storage.ts'

const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')

const clean = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 24)

const REFERRERS: [RegExp, string][] = [
  [/(^|\.)google\.|(^|\.)bing\.com|duckduckgo\.com|search\.yahoo\.|ecosia\.org/, 'organico'],
  [/instagram\.com/, 'instagram'],
  [/(^|\.)facebook\.com|(^|\.)fb\.com|messenger\.com/, 'facebook'],
  [/tiktok\.com/, 'tiktok'],
  [/(^|\.)t\.co$|twitter\.com|(^|\.)x\.com/, 'x'],
  [/whatsapp\.com|wa\.me/, 'whatsapp'],
  [/youtube\.com|youtu\.be/, 'youtube'],
  [/pinterest\./, 'pinterest'],
  [/threads\.net/, 'threads'],
]

function detectChannel() {
  const params = new URLSearchParams(window.location.search)
  const utm = params.get('utm_source') ?? params.get('ref') ?? params.get('canal')
  if (utm) return clean(utm) || 'direto'
  try {
    const ref = document.referrer ? new URL(document.referrer) : null
    if (!ref || ref.host === window.location.host) return 'direto'
    return REFERRERS.find(([re]) => re.test(ref.hostname))?.[1] ?? 'referencia'
  } catch {
    return 'direto'
  }
}

/** Canal da sessão, fixado na primeira página vista (assim não muda ao navegar pelo site). */
export function getChannel() {
  if (typeof window === 'undefined') return 'direto'
  const saved = readSession<string>('pc:canal')
  if (saved) return saved
  const channel = detectChannel()
  writeSession('pc:canal', channel)
  return channel
}

function randomCode() {
  const bytes = new Uint8Array(12)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(36).padStart(2, '0')).join('')
}

export function getSession() {
  const saved = readSession<string>('pc:sessao')
  if (saved) return saved
  const session = randomCode()
  writeSession('pc:sessao', session)
  return session
}

export type EventType =
  | 'visit'
  | 'quiz_start'
  | 'step'
  | 'quiz_submit'
  | 'result_view'
  | 'result_error'
  | 'fallback_shown'
  | 'more_ideas'
  | 'share'
  | 'report'
  | 'guide_cta'

/** Envia um evento anônimo. Usa sendBeacon (não atrasa a página nem se perde ao sair dela). */
export function track(type: EventType, extra: { step?: number; resultId?: string | null } = {}) {
  if (typeof window === 'undefined' || !API_URL) return
  const body = JSON.stringify({
    type,
    step: extra.step,
    resultId: extra.resultId ?? undefined,
    channel: getChannel(),
    session: getSession(),
    page: window.location.pathname.replace(/^\/r\/.+/, '/r/[id]').slice(0, 80),
  })
  const url = `${API_URL}/api/events`
  try {
    if (navigator.sendBeacon?.(url, new Blob([body], { type: 'text/plain' }))) return
  } catch {
    // segue para o fetch
  }
  fetch(url, { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(() => {})
}

/** Registra a visita uma vez por sessão. */
export function trackVisit() {
  if (readSession<boolean>('pc:visita')) return
  writeSession('pc:visita', true)
  track('visit')
}
