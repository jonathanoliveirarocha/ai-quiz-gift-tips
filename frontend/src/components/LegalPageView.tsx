import { ChevronRight } from 'lucide-react'
import type { LegalPage } from '../content/legal/types.ts'

const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

export default function LegalPageView({ page }: { page: LegalPage }) {
  return (
    <article className="legal">
      <nav className="breadcrumb" aria-label="Você está em">
        <ol>
          <li>
            <a href="/">Início</a>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={14} />
          </li>
          <li aria-current="page">{page.h1}</li>
        </ol>
      </nav>
      <header className="legal-head">
        <h1 className="guide-title">{page.h1}</h1>
        <p className="guide-updated">
          Atualizado em <time dateTime={page.updated}>{formatDate(page.updated)}</time>
        </p>
        <p className="legal-intro">{page.intro}</p>
      </header>
      {page.sections.map((section) => (
        <section key={section.heading} className="legal-section">
          <h2>{section.heading}</h2>
          {section.paragraphs.map((p) => (
            <p key={p.slice(0, 50)}>{p}</p>
          ))}
          {section.items && (
            <ul>
              {section.items.map((item) => (
                <li key={item.slice(0, 50)}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </article>
  )
}
