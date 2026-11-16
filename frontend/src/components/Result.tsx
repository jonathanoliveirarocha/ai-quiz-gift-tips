import { useState } from 'react'
import { motion } from 'motion/react'
import { Check, Copy, Lightbulb, PencilLine, RefreshCw, RotateCcw, Share2, Ban, Info, ExternalLink } from 'lucide-react'
import GiftCard, { KIND_LABEL, StoreButtons, categoryHue, formatPrice, showKind } from './GiftCard.tsx'
import { trackClick } from '../api.ts'
import type { QuizResponse } from '../types.ts'

type Props = {
  data: QuizResponse
  onRestart: () => void
  onEdit: () => void
  onMoreIdeas: (exclude: string[]) => void
}

function ConfidenceRing({ value }: { value: number }) {
  const r = 34
  const c = 2 * Math.PI * r
  return (
    <div className="ring" title={`${value}% de combinação`}>
      <svg viewBox="0 0 80 80">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff7a6b" />
            <stop offset=".5" stopColor="#ff4fb3" />
            <stop offset="1" stopColor="#8b6cff" />
          </linearGradient>
        </defs>
        <circle cx="40" cy="40" r={r} className="ring-track" />
        <motion.circle
          cx="40"
          cy="40"
          r={r}
          className="ring-value"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - value / 100) }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="ring-label">
        <strong>{value}%</strong>
        <span>match</span>
      </div>
    </div>
  )
}

export default function Result({ data, onRestart, onEdit, onMoreIdeas }: Props) {
  const { result, catalog, answers, id, mode } = data
  const { idealGift: ideal, profile } = result
  const [copied, setCopied] = useState<'card' | 'link' | null>(null)
  const name = answers?.name?.trim()

  function flash(kind: 'card' | 'link') {
    setCopied(kind)
    window.setTimeout(() => setCopied(null), 2000)
  }

  async function copyCard() {
    await navigator.clipboard.writeText(result.cardMessage).catch(() => {})
    flash('card')
  }

  async function share() {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: 'Presente Certo', text: `O presente ideal: ${ideal.title}`, url }).catch(() => {})
      return
    }
    await navigator.clipboard.writeText(url).catch(() => {})
    flash('link')
  }

  const exclude = [ideal.title, ...result.suggestions.map((s) => s.title)]

  return (
    <div className="result">
      {mode === 'demo' && (
        <div className="demo-banner">
          <Info size={18} />
          <span>
            <strong>Modo demonstração:</strong> as sugestões abaixo são exemplos gerais e ainda não foram personalizadas
            pela IA.
          </span>
        </div>
      )}

      <motion.div className="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <span className="pill">
          {profile.emoji} {profile.archetype}
        </span>
        {profile.summary && <p>{profile.summary}</p>}
      </motion.div>

      <motion.section
        className="ideal glass"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ ['--hue' as string]: categoryHue(ideal.category) }}
      >
        <div className="ideal-visual">
          <motion.span
            className="ideal-emoji"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.15 }}
          >
            {ideal.emoji}
          </motion.span>
          <ConfidenceRing value={ideal.confidence} />
        </div>

        <div className="ideal-body">
          <span className="eyebrow">O presente ideal {name ? `para ${name}` : 'para essa pessoa'}</span>
          <h1 className="ideal-title">{ideal.title}</h1>
          {ideal.description && <p className="ideal-desc">{ideal.description}</p>}
          <div className="ideal-meta">
            <span className="price-pill">{formatPrice(ideal.priceMin, ideal.priceMax)}</span>
            <span className="tag">{ideal.category}</span>
            {showKind(ideal) && <span className="tag tag-alt">{KIND_LABEL[ideal.kind]}</span>}
          </div>
          {ideal.why && (
            <blockquote className="ideal-why">
              <Lightbulb size={18} />
              <p>{ideal.why}</p>
            </blockquote>
          )}
          <StoreButtons stores={ideal.stores} title={ideal.title} resultId={id} kind="ideal" primary />
        </div>
      </motion.section>

      <section className="extras">
        {result.cardMessage && (
          <motion.div className="note" initial={{ opacity: 0, rotate: -2, y: 20 }} animate={{ opacity: 1, rotate: -1.2, y: 0 }} transition={{ delay: 0.35 }}>
            <span className="note-label">Mensagem para o cartão</span>
            <p className="note-text">{result.cardMessage}</p>
            <button className="note-copy" onClick={copyCard}>
              {copied === 'card' ? <Check size={16} /> : <Copy size={16} />}
              {copied === 'card' ? 'Copiada!' : 'Copiar'}
            </button>
          </motion.div>
        )}
        <div className="tips">
          {result.deliveryTip && (
            <div className="tip glass">
              <span className="tip-icon">🎀</span>
              <div>
                <h4>Dica para entregar</h4>
                <p>{result.deliveryTip}</p>
              </div>
            </div>
          )}
          {result.avoid.length > 0 && (
            <div className="tip glass">
              <span className="tip-icon">
                <Ban size={20} />
              </span>
              <div>
                <h4>Melhor evitar</h4>
                <div className="avoid-list">
                  {result.avoid.map((a) => (
                    <span key={a}>{a}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {catalog.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Ofertas selecionadas</h2>
            <p>Produtos parceiros que combinam com esse perfil.</p>
          </div>
          <div className="catalog-grid">
            {catalog.map((p) => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="catalog-card glass"
                onClick={() => trackClick({ resultId: id, title: p.title, store: p.store, url: p.url, kind: 'catalog' })}
              >
                {p.imageUrl ? <img src={p.imageUrl} alt="" loading="lazy" /> : <span className="catalog-placeholder">🎁</span>}
                <span className="tag">{p.storeName}</span>
                <h3>{p.title}</h3>
                {p.price !== undefined && p.price !== null && <strong>{formatPrice(p.price, p.price)}</strong>}
                <span className="catalog-cta">
                  Ver oferta <ExternalLink size={14} />
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {result.suggestions.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Outras ideias que combinam</h2>
            <p>Opções em faixas e estilos diferentes, todas dentro do orçamento.</p>
          </div>
          <div className="gift-grid">
            {result.suggestions.map((s, i) => (
              <GiftCard key={s.title + i} item={s} resultId={id} index={i} />
            ))}
          </div>
        </section>
      )}

      <section className="result-actions">
        <button className="btn btn-primary" onClick={() => onMoreIdeas(exclude)}>
          <RefreshCw size={18} /> Quero outras ideias
        </button>
        {id && (
          <button className="btn btn-light" onClick={share}>
            {copied === 'link' ? <Check size={18} /> : <Share2 size={18} />}
            {copied === 'link' ? 'Link copiado!' : 'Compartilhar resultado'}
          </button>
        )}
        <button className="btn btn-ghost" onClick={onEdit}>
          <PencilLine size={18} /> Ajustar respostas
        </button>
        <button className="btn btn-ghost" onClick={onRestart}>
          <RotateCcw size={18} /> Novo presente
        </button>
      </section>
    </div>
  )
}
