import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics, type BeforeSendEvent } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import './styles.css'
import App from './App.tsx'

// Agrupa os links de resultado (/r/<id>) em uma única rota nos painéis da Vercel.
const groupResultRoutes = <T extends { url: string }>(event: T) => ({
  ...event,
  url: event.url.replace(/\/r\/[a-f\d]{24}/i, '/r/[id]'),
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Analytics beforeSend={(event: BeforeSendEvent) => groupResultRoutes(event)} />
    <SpeedInsights beforeSend={groupResultRoutes} />
  </StrictMode>,
)
