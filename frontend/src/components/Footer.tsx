import { GUIDE_LINKS } from '../content/guides/registry.ts'
import { LEGAL_LINKS } from '../content/legal/registry.ts'
import { AMAZON_DISCLOSURE } from '../content/stores.ts'

export default function Footer() {
  return (
    <footer className="footer">
      <nav className="footer-nav" aria-label="Guias de presente">
        <a href="/" className="footer-brand">
          🎁 Presente Certo
        </a>
        <ul>
          {GUIDE_LINKS.map((g) => (
            <li key={g.slug}>
              <a href={`/${g.slug}`}>{g.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="footer-legal">
        <p>
          Os links para comprar são de afiliado: podemos receber uma comissão, sem custo extra para você. Os preços são estimativas. {AMAZON_DISCLOSURE}
        </p>
        <nav aria-label="Institucional">
          <ul>
            {LEGAL_LINKS.map((l) => (
              <li key={l.slug}>
                <a href={`/${l.slug}`}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
