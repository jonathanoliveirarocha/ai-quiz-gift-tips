import { GUIDE_LINKS } from '../content/guides/registry.ts'

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
      <p>
        Preços são estimativas e podem mudar. Confira o valor final na loja. Alguns links podem ser de afiliados, sem
        custo extra para você.
      </p>
    </footer>
  )
}
