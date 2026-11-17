import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Ban, Check, Copy, ExternalLink, Flag, Info, Lightbulb, PencilLine, RefreshCw, RotateCcw, Share2, Sparkles } from 'lucide-react'
import GiftCard, { ProductPreview, StoreButtons } from './GiftCard.tsx'
import { getStoreLinks, reportResult, trackClick } from '../api.ts'
import { categoryHue, formatPrice, KIND_LABEL, showKind } from '../lib/format.ts'
import { personalize } from '../lib/personalize.ts'
import { track } from '../lib/tracking.ts'
import type { GiftItem, QuizResponse } from '../types.ts'

type Props = {
  data: QuizResponse
  /** Nome para exibir (das respostas ou do link compartilhado). Nunca vem do servidor. */
  name: string
  /** true para quem acabou de fazer o quiz; false para quem abriu um link. */
  isOwner: boolean
  /** Aviso no topo (ex.: "Quero outras ideias" falhou e o resultado anterior foi mantido). */
  notice?: string | null
  onRestart: () => void
  onEdit: () => void
  onMoreIdeas: (exclude: string[]) => void
}

const shareUrl = (id: string, name: string) =>
  `${window.location.origin}/r/${id}?utm_source=compartilhado${name ? `#n=${encodeURIComponent(name)}` : ''}`

export default function Result({ data, name, isOwner, notice, onRestart, onEdit, onMoreIdeas }: Props) {
  const { result, catalog, answers, id, mode } = data
  const [items, setItems] = useState<{ ideal: GiftItem; suggestions: GiftItem[] }>({ ideal: result.idealGift, suggestions: result.suggestions })
  const [copied, setCopied] = useState<'card' | 'link' | null>(null)
  const [reported, setReported] = useState(false)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const ideal = items.ideal
  const forMe = answers.relationship === 'Eu mesmo'
  const say = (text: string) => personalize(text, name)

  useEffect(() => {
    track('result_view', { resultId: id })
    if (mode === 'acervo') track('fallback_shown', { resultId: id })
    titleRef.current?.focus({ preventScroll: true })
  }, [id, mode])

  // Produto real da Shopee (foto, preço e link oficial) para cada ideia, quando a API estiver ativa.
  useEffect(() => {
    let alive = true
    const all = [result.idealGift, ...result.suggestions]
    getStoreLinks(all.map((g) => ({ query: g.query, min: g.priceMin, max: g.priceMax })))
      .then((links) => {
        if (!alive || !links.some((l) => l.product)) return
        const merge = (g: GiftItem, i: number): GiftItem => (links[i]?.product ? { ...g, stores: links[i].stores, product: links[i].product } : g)
        setItems({ ideal: merge(result.idealGift, 0), suggestions: result.suggestions.map((s, i) => merge(s, i + 1)) })
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [result])

  function flash(kind: 'card' | 'link') {
    setCopied(kind)
    window.setTimeout(() => setCopied(null), 2000)
  }

  async function copyCard() {
    await navigator.clipboard.writeText(say(result.cardMessage)).catch(() => {})
    flash('card')
  }

  // O texto de compartilhamento não revela o presente: a surpresa continua.
  async function share() {
    if (!id) return
    const url = shareUrl(id, name)
    const text = 'Descobri ideias de presente com a ajuda da IA 🎁 Dá uma olhada:'
    track('share', { resultId: id })
    if (navigator.share) {
      await navigator.share({ title: 'Presente Certo', text, url }).catch(() => {})
      return
    }
    await navigator.clipboard.writeText(`${text} ${url}`).catch(() => {})
    flash('link')
  }

  async function report() {
    if (!id || reported) return
    if (!window.confirm('Denunciar este resultado por conteúdo impróprio? Ele será revisado e pode sair do ar.')) return
    await reportResult(id).catch(() => {})
    track('report', { resultId: id })
    setReported(true)
  }

  const exclude = [ideal.title, ...items.suggestions.map((s) => s.title)]
  const forWho = name ? `para ${name}` : forMe ? 'para você' : 'para essa pessoa'

  return (
    <div className="result">
      {notice && (
        <div className="demo-banner" role="status">
          <Info size={18} aria-hidden="true" />
          <span>{notice}</span>
        </div>
      )}
      {mode === 'acervo' && (
        <div className="demo-banner" role="status">
          <Sparkles size={18} aria-hidden="true" />
          <span>
            <strong>A IA está com muita procura agora.</strong> Separamos ideias do nosso acervo que combinam com as respostas. Para sugestões ainda mais
            personalizadas, toque em "Quero outras ideias" daqui a alguns minutos.
          </span>
        </div>
      )}
      {mode === 'demo' && (
        <div className="demo-banner" role="status">
          <Info size={18} aria-hidden="true" />
          <span>
            <strong>Modo demonstração:</strong> as sugestões abaixo são exemplos gerais e ainda não foram personalizadas pela IA.
          </span>
        </div>
      )}

      <motion.div className="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <span className="pill">
          <span aria-hidden="true">{result.profile.emoji}</span> {say(result.profile.archetype)}
        </span>
        {result.profile.summary && <p>{say(result.profile.summary)}</p>}
      </motion.div>

      <motion.section
        className="ideal glass"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ ['--hue' as string]: categoryHue(ideal.category) }}
        aria-labelledby="presente-ideal"
      >
        <div className="ideal-visual" aria-hidden="true">
          <motion.span
            className="ideal-emoji"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.15 }}
          >
            {ideal.emoji}
          </motion.span>
          <span className="ideal-badge">
            <Sparkles size={14} /> Escolha principal
          </span>
        </div>

        <div className="ideal-body">
          <span className="eyebrow">O presente ideal {forWho}</span>
          <h1 className="ideal-title" id="presente-ideal" ref={titleRef} tabIndex={-1}>
            {ideal.title}
          </h1>
          {ideal.description && <p className="ideal-desc">{say(ideal.description)}</p>}
          <div className="ideal-meta">
            <span className="price-pill" title="Faixa de preço estimada pela IA. Confira o valor na loja.">
              <span className="price-label">Estimativa</span> {formatPrice(ideal.priceMin, ideal.priceMax)}
            </span>
            <span className="tag">{ideal.category}</span>
            {showKind(ideal) && <span className="tag tag-alt">{KIND_LABEL[ideal.kind]}</span>}
          </div>
          {ideal.why && (
            <blockquote className="ideal-why">
              <Lightbulb size={18} aria-hidden="true" />
              <p>{say(ideal.why)}</p>
            </blockquote>
          )}
          {ideal.product && <ProductPreview product={ideal.product} title={ideal.title} resultId={id} kind="ideal" />}
          <StoreButtons stores={ideal.stores} title={ideal.title} resultId={id} kind="ideal" primary hasProduct={Boolean(ideal.product)} />
          <p className="affiliate-note">Link de afiliado: podemos ganhar comissão, sem custo extra para você. Confira os detalhes na loja.</p>
        </div>
      </motion.section>

      <section className="extras">
        {result.cardMessage && (
          <motion.div className="note" initial={{ opacity: 0, rotate: -2, y: 20 }} animate={{ opacity: 1, rotate: -1.2, y: 0 }} transition={{ delay: 0.35 }}>
            <span className="note-label">Mensagem para o cartão</span>
            <p className="note-text">{say(result.cardMessage)}</p>
            <button className="note-copy" onClick={copyCard}>
              {copied === 'card' ? <Check size={16} /> : <Copy size={16} />}
              {copied === 'card' ? 'Copiada!' : 'Copiar'}
            </button>
          </motion.div>
        )}
        <div className="tips">
          {result.deliveryTip && (
            <div className="tip glass">
              <span className="tip-icon" aria-hidden="true">
                🎀
              </span>
              <div>
                <h2 className="tip-title">Dica para entregar</h2>
                <p>{say(result.deliveryTip)}</p>
              </div>
            </div>
          )}
          {result.avoid.length > 0 && (
            <div className="tip glass">
              <span className="tip-icon" aria-hidden="true">
                <Ban size={20} />
              </span>
              <div>
                <h2 className="tip-title">Melhor evitar</h2>
                <div className="avoid-list">
                  {result.avoid.map((a) => (
                    <span key={a}>{say(a)}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {items.suggestions.length > 0 && (
        <section className="section" aria-labelledby="outras-ideias">
          <div className="section-head">
            <h2 id="outras-ideias">Outras ideias que combinam</h2>
            <p>Opções em faixas e estilos diferentes, pensadas para o seu orçamento.</p>
          </div>
          <div className="gift-grid">
            {items.suggestions.map((s, i) => (
              <GiftCard key={s.title + i} item={s} resultId={id} index={i} name={name} />
            ))}
          </div>
        </section>
      )}

      {catalog.length > 0 && (
        <section className="section" aria-labelledby="ofertas">
          <div className="section-head">
            <h2 id="ofertas">Ofertas selecionadas</h2>
            <p>Produtos de lojas parceiras que combinam com esse perfil. Links de afiliado; ninguém paga para aparecer aqui.</p>
          </div>
          <div className="catalog-grid">
            {catalog.map((p) => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer sponsored nofollow"
                className="catalog-card glass"
                onClick={() => trackClick({ resultId: id, title: p.title, store: p.store, url: p.url, kind: 'catalog' })}
              >
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt="" loading="lazy" />
                ) : (
                  <span className="catalog-placeholder" aria-hidden="true">
                    🎁
                  </span>
                )}
                <span className="tag">{p.storeName}</span>
                <h3>{p.title}</h3>
                {p.price !== undefined && p.price !== null && <strong>{formatPrice(p.price, p.price)}</strong>}
                <span className="catalog-cta">
                  Ver oferta <ExternalLink size={14} aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="result-actions" aria-label="O que fazer agora">
        {isOwner ? (
          <>
            {id && (
              <button className="btn btn-primary" onClick={share}>
                {copied === 'link' ? <Check size={18} /> : <Share2 size={18} />}
                {copied === 'link' ? 'Link copiado!' : 'Compartilhar'}
              </button>
            )}
            <button className="btn btn-light" onClick={() => onMoreIdeas(exclude)}>
              <RefreshCw size={18} /> Quero outras ideias
            </button>
            <button className="btn btn-ghost" onClick={onEdit}>
              <PencilLine size={18} /> Ajustar respostas
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-primary" onClick={onRestart}>
              <Sparkles size={18} /> Fazer o meu quiz grátis
            </button>
            {id && (
              <button className="btn btn-light" onClick={share}>
                {copied === 'link' ? <Check size={18} /> : <Share2 size={18} />}
                {copied === 'link' ? 'Link copiado!' : 'Compartilhar'}
              </button>
            )}
          </>
        )}
        {isOwner && (
          <button className="btn btn-ghost" onClick={onRestart}>
            <RotateCcw size={18} /> Novo presente
          </button>
        )}
      </section>

      {!isOwner && id && (
        <footer className="result-legal">
          <button className="link-btn" onClick={report} disabled={reported}>
            <Flag size={14} aria-hidden="true" /> {reported ? 'Denúncia enviada. Obrigado!' : 'Denunciar conteúdo impróprio'}
          </button>
        </footer>
      )}
    </div>
  )
}
