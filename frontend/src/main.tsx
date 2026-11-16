import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { Analytics, type BeforeSendEvent } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import './styles.css'
import App from './App.tsx'
import { loadGuide } from './content/guides/registry.ts'
import { routeKey } from './routes.ts'

// Agrupa os links de resultado (/r/<id>) em uma única rota nos painéis da Vercel.
const groupResultRoutes = <T extends { url: string }>(event: T) => ({
  ...event,
  url: event.url.replace(/\/r\/[a-f\d]{24}/i, '/r/[id]'),
})

const app = (
  <StrictMode>
    <App path={window.location.pathname} />
    <Analytics beforeSend={(event: BeforeSendEvent) => groupResultRoutes(event)} />
    <SpeedInsights beforeSend={groupResultRoutes} />
  </StrictMode>
)

const container = document.getElementById('root')!

// No build, cada página já vem com o HTML pronto (scripts/prerender.mjs): o React só "acorda" esse HTML.
// No `npm run dev` o #root vem vazio e o React renderiza do zero.
// Em página de guia, o texto do guia é baixado antes (o HTML já está visível enquanto isso).
const slug = window.location.pathname.replace(/^\/+|\/+$/g, '')
loadGuide(slug)
  .catch(() => undefined)
  .finally(() => {
    if (container.firstElementChild && container.dataset.route === routeKey(window.location.pathname)) {
      hydrateRoot(container, app)
    } else {
      container.replaceChildren()
      createRoot(container).render(app)
    }
  })
