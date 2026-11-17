import { useEffect, useState } from 'react'
import { ArrowRight, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react'
import { guideLink, type GuideLink } from '../content/guides/registry.ts'
import { STORE_NAMES } from '../content/stores.ts'
import type { Guide, GuidePreset } from '../content/types.ts'
import { getStoreLinks } from '../api.ts'
import { plainStoreLinks } from '../lib/storeSearch.ts'
import { track } from '../lib/tracking.ts'
import type { StoreLinksItem } from '../types.ts'
import Faq from './Faq.tsx'
import { ProductPreview, StoreButtons } from './GiftCard.tsx'

const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

function QuizCta({ guide, onStart, compact = false }: { guide: Guide; onStart: (preset: GuidePreset) => void; compact?: boolean }) {
  return (
    <div className={`guide-cta${compact ? ' guide-cta-compact' : ''}`}>
      <button
        className="btn btn-primary btn-lg"
        onClick={() => {
          track('guide_cta')
          onStart(guide.preset)
        }}
      >
        {guide.cta} <ArrowRight size={20} />
      </button>
      <span className="hero-note">
        <ShieldCheck size={16} /> Grátis · 2 minutos · sem cadastro
      </span>
    </div>
  )
}

export default function GuidePage({ guide, onStart }: { guide: Guide; onStart: (preset: GuidePreset) => void }) {
  const related = guide.related.map(guideLink).filter((g): g is GuideLink => Boolean(g))
  // Links de afiliado (e produto real da Shopee) chegam do backend depois que a página abre.
  const [links, setLinks] = useState<Record<string, StoreLinksItem>>({})

  useEffect(() => {
    let alive = true
    getStoreLinks(guide.ideas.flatMap((group) => group.items.map((i) => ({ query: i.query }))))
      .then((items) => {
        if (alive) setLinks(Object.fromEntries(items.map((item) => [item.query, item])))
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [guide])

  return (
    <article className="guide">
      <nav className="breadcrumb" aria-label="Você está em">
        <ol>
          <li>
            <a href="/">Início</a>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={14} />
          </li>
          <li aria-current="page">{guide.label}</li>
        </ol>
      </nav>

      <header className="guide-hero">
        <span className="guide-emoji" aria-hidden="true">
          {guide.emoji}
        </span>
        <span className="pill">
          <Sparkles size={14} /> Guia de presentes
        </span>
        <h1 className="guide-title">{guide.h1}</h1>
        <div className="guide-intro">
          {guide.intro.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
        <QuizCta guide={guide} onStart={onStart} />
        <p className="guide-updated">
          Por Equipe Mimo Certo · Atualizado em <time dateTime={guide.updated}>{formatDate(guide.updated)}</time> ·{' '}
          <a href="/quem-somos">Como fazemos os guias</a>
        </p>
      </header>

      <section className="guide-section" aria-labelledby="dicas">
        <div className="section-head">
          <h2 id="dicas">Como escolher sem errar</h2>
        </div>
        <ol className="guide-tips">
          {guide.tips.map((tip, i) => (
            <li key={tip.title} className="guide-tip glass">
              <span className="step-number">0{i + 1}</span>
              <h3>{tip.title}</h3>
              <p>{tip.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {guide.ideas.map((group, gi) => (
        <section key={group.heading} className="guide-section" aria-labelledby={`ideias-${gi}`}>
          <div className="section-head">
            <h2 id={`ideias-${gi}`}>{group.heading}</h2>
            {group.intro && <p>{group.intro}</p>}
          </div>
          {gi === 0 && <p className="affiliate-note">Links de afiliado: se você comprar, podemos ganhar uma comissão, sem custo extra para você.</p>}
          <ul className="guide-ideas">
            {group.items.map((idea) => {
              const live = links[idea.query]
              return (
                <li key={idea.title} className="guide-idea glass">
                  <span className="guide-idea-emoji" aria-hidden="true">
                    {idea.emoji}
                  </span>
                  <div className="guide-idea-body">
                    <h3>{idea.title}</h3>
                    <p>{idea.text}</p>
                    {live?.product && <ProductPreview product={live.product} title={idea.title} resultId={null} kind="guide" />}
                    <StoreButtons
                      stores={live?.stores ?? plainStoreLinks(idea.query, STORE_NAMES)}
                      title={idea.title}
                      resultId={null}
                      kind="guide"
                      hasProduct={Boolean(live?.product)}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      <aside className="guide-banner glass" aria-label="Quiz do presente ideal">
        <span className="guide-banner-emoji" aria-hidden="true">
          🎁
        </span>
        <div>
          <h2>Ainda na dúvida?</h2>
          <p>
            Responda perguntas rápidas sobre o jeito, os gostos e a rotina da pessoa. A IA indica o presente que mais combina,
            explica o porquê e mostra opções em lojas confiáveis.
          </p>
        </div>
        <QuizCta guide={guide} onStart={onStart} compact />
      </aside>

      <section className="guide-section" aria-labelledby="faq">
        <div className="section-head">
          <h2 id="faq">Perguntas frequentes</h2>
        </div>
        <Faq items={guide.faq} />
      </section>

      {related.length > 0 && (
        <nav className="guide-section" aria-labelledby="relacionados">
          <div className="section-head">
            <h2 id="relacionados">Mais ideias de presente</h2>
          </div>
          <ul className="guide-links">
            {related.map((g) => (
              <li key={g.slug}>
                <a className="guide-link glass" href={`/${g.slug}`}>
                  <span aria-hidden="true">{g.emoji}</span>
                  {g.label}
                  <ArrowRight size={16} />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </article>
  )
}
