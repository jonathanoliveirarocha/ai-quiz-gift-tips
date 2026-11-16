import { useEffect, useState } from 'react'
import { getHealth } from '../api.ts'
import type { Health } from '../types.ts'

export default function Footer() {
  const [health, setHealth] = useState<Health | null>(null)
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    let timer: number | undefined
    const check = () =>
      getHealth()
        .then((h) => {
          setHealth(h)
          setOffline(false)
          // Enquanto o banco ainda está subindo, confere de novo.
          if (h.db.state === 'conectando') timer = window.setTimeout(check, 4000)
        })
        .catch(() => {
          setOffline(true)
          timer = window.setTimeout(check, 4000)
        })
    check()
    return () => window.clearTimeout(timer)
  }, [])

  const ai = offline ? 'backend offline' : health?.ai === 'gemini' ? `IA: ${health.model}` : health ? 'modo demonstração' : '...'
  const db = health ? `banco: ${health.db.state}${health.db.mode ? ` (${health.db.mode})` : ''}` : ''

  return (
    <footer className="footer">
      <p>
        Preços são estimativas e podem mudar. Confira o valor final na loja. Alguns links podem ser de afiliados, sem
        custo extra para você.
      </p>
      <div className="status">
        <span className={`dot ${offline ? 'off' : health?.ai === 'gemini' ? 'on' : 'warn'}`} />
        {ai}
        {db && <span className="status-sep">·</span>}
        {db}
      </div>
    </footer>
  )
}
