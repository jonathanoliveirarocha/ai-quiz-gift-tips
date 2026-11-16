import { motion } from 'motion/react'
import { ExternalLink } from 'lucide-react'
import { trackClick } from '../api.ts'
import type { ClickKind, GiftItem, StoreLink } from '../types.ts'

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

export function formatPrice(min: number | null, max: number | null) {
  if (min && max) return min === max ? brl.format(min) : `${brl.format(min)} a ${brl.format(max)}`
  if (min) return `a partir de ${brl.format(min)}`
  if (max) return `até ${brl.format(max)}`
  return 'preço variável'
}

export const KIND_LABEL: Record<GiftItem['kind'], string> = {
  produto: 'Produto',
  experiencia: 'Experiência',
  personalizado: 'Personalizado',
  assinatura: 'Assinatura',
}

const plain = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// Mostra o tipo (Experiência, Personalizado...) só quando ele não repete a categoria.
export const showKind = (item: GiftItem) =>
  item.kind !== 'produto' && !plain(item.category).includes(plain(KIND_LABEL[item.kind]).slice(0, 8))

// Cada categoria ganha uma cor estável a partir do nome.
export function categoryHue(category: string) {
  let hash = 0
  for (const ch of category) hash = (hash * 31 + ch.charCodeAt(0)) % 360
  return hash
}

type StoreButtonsProps = { stores: StoreLink[]; title: string; resultId: string | null; kind: ClickKind; primary?: boolean }

export function StoreButtons({ stores, title, resultId, kind, primary = false }: StoreButtonsProps) {
  return (
    <div className={`store-buttons ${primary ? 'primary' : ''}`}>
      {stores.map((s, i) => (
        <a
          key={s.store}
          href={s.url}
          target="_blank"
          rel={`noopener noreferrer${s.affiliate ? ' sponsored' : ''}`}
          className={`store-btn store-${s.store} ${primary && i === 0 ? 'first' : ''}`}
          onClick={() => trackClick({ resultId, title, store: s.store, url: s.url, kind })}
        >
          <span className="store-dot" />
          {s.name}
          <ExternalLink size={14} />
        </a>
      ))}
    </div>
  )
}

type Props = { item: GiftItem; resultId: string | null; index: number }

export default function GiftCard({ item, resultId, index }: Props) {
  return (
    <motion.article
      className="gift-card glass"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: (index % 3) * 0.08 }}
      style={{ ['--hue' as string]: categoryHue(item.category) }}
    >
      <div className="gift-card-head">
        <span className="gift-card-emoji">{item.emoji}</span>
        <div className="gift-card-tags">
          <span className="tag">{item.category}</span>
          {showKind(item) && <span className="tag tag-alt">{KIND_LABEL[item.kind]}</span>}
        </div>
      </div>
      <h3 className="gift-card-title">{item.title}</h3>
      {item.description && <p className="gift-card-desc">{item.description}</p>}
      {item.why && (
        <p className="gift-card-why">
          <strong>Por que combina:</strong> {item.why}
        </p>
      )}
      <div className="gift-card-price">{formatPrice(item.priceMin, item.priceMax)}</div>
      <StoreButtons stores={item.stores} title={item.title} resultId={resultId} kind="suggestion" />
    </motion.article>
  )
}
