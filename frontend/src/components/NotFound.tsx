import { ArrowRight } from 'lucide-react'
import { GUIDE_LINKS } from '../content/guides/registry.ts'

export default function NotFound({ onStart }: { onStart: () => void }) {
  return (
    <div className="not-found">
      <section className="error-state glass">
        <div className="error-emoji" aria-hidden="true">
          🎈
        </div>
        <h1>Essa página não existe</h1>
        <p>O link pode estar errado ou a página mudou de endereço. Que tal descobrir o presente ideal agora?</p>
        <div className="error-actions">
          <button className="btn btn-primary" onClick={onStart}>
            Fazer o quiz grátis <ArrowRight size={18} />
          </button>
          <a className="btn btn-ghost" href="/">
            Ir para o início
          </a>
        </div>
      </section>
      <ul className="guide-links">
        {GUIDE_LINKS.slice(0, 8).map((g) => (
          <li key={g.slug}>
            <a className="guide-link glass" href={`/${g.slug}`}>
              <span aria-hidden="true">{g.emoji}</span>
              {g.label}
              <ArrowRight size={16} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
