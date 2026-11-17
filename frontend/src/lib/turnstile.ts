// Cloudflare Turnstile (anti-robô), opcional: só liga com VITE_TURNSTILE_SITE_KEY no frontend
// e TURNSTILE_SECRET_KEY no backend. Para a maioria das pessoas é invisível.
type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string
  execute: (id: string) => void
  reset: (id: string) => void
}
declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined
let scriptPromise: Promise<void> | null = null

function loadScript() {
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('turnstile'))
    document.head.appendChild(script)
  })
  return scriptPromise
}

/** Começa a carregar o script cedo (ao abrir o quiz), para não atrasar o envio. */
export const preloadTurnstile = () => {
  if (SITE_KEY) loadScript().catch(() => {})
}

/** Devolve um token novo a cada chamada, ou undefined se o Turnstile estiver desligado ou indisponível. */
export async function getTurnstileToken(): Promise<string | undefined> {
  if (!SITE_KEY) return undefined
  try {
    await loadScript()
    const api = window.turnstile
    if (!api) return undefined
    const container = document.createElement('div')
    container.style.position = 'fixed'
    container.style.bottom = '16px'
    container.style.right = '16px'
    container.style.zIndex = '50'
    document.body.appendChild(container)
    return await new Promise<string | undefined>((resolve) => {
      const done = (token?: string) => {
        container.remove()
        resolve(token)
      }
      const id = api.render(container, {
        sitekey: SITE_KEY,
        appearance: 'interaction-only',
        execution: 'execute',
        language: 'pt-br',
        callback: (token: string) => done(token),
        'error-callback': () => done(undefined),
        'timeout-callback': () => done(undefined),
      })
      api.execute(id)
      setTimeout(() => done(undefined), 15000)
    })
  } catch {
    return undefined
  }
}
