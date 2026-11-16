import { ChevronDown } from 'lucide-react'

/** Perguntas frequentes em <details>: o texto fica no HTML (bom para o Google) e abre com um toque. */
export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq">
      {items.map(({ q, a }) => (
        <details key={q} className="faq-item glass">
          <summary>
            <h3>{q}</h3>
            <ChevronDown size={20} className="faq-chevron" aria-hidden="true" />
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  )
}
