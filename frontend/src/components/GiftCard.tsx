import { motion } from 'motion/react'
import { ExternalLink, Star } from 'lucide-react'
import { trackClick } from '../api.ts'
import { formatPrice, KIND_LABEL, categoryHue, showKind, brl } from '../lib/format.ts'
import { personalize } from '../lib/personalize.ts'
import type { ClickKind, GiftItem, ShopeeProduct, StoreLink } from '../types.ts'

type StoreButtonsProps = {
  stores: StoreLink[]
  title: string
  resultId: string | null
  kind: ClickKind
  primary?: boolean
  /** Com produto real da Shopee, o botão diz "Ver produto". */
  hasProduct?: boolean
}

/** Botões de compra: verbo claro, área de toque grande e marcação de link patrocinado. */
export function StoreButtons({ stores, title, resultId, kind, primary = false, hasProduct = false }: StoreButtonsProps) {
  return (
    <div className={`store-buttons ${primary ? 'primary' : ''}`}>
      {stores.map((s, i) => (
        <a
          key={s.store}
          href={s.url}
          target="_blank"
          rel={`noopener noreferrer${s.affiliate ? ' sponsored nofollow' : ''}`}
          className={`store-btn store-${s.store} ${primary && i === 0 ? 'first' : ''}`}
          onClick={() => trackClick({ resultId, title, store: s.store, url: s.url, kind })}
          aria-label={`${s.store === 'shopee' && hasProduct ? 'Ver o produto' : 'Ver opções'} de ${title} na ${s.name} (abre em nova aba)`}
        >
          <span className="store-dot" aria-hidden="true" />
          {s.store === 'shopee' && hasProduct ? 'Ver produto na' : 'Ver na'} {s.name}
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      ))}
    </div>
  )
}

/** Produto real da Shopee (foto e preço vêm da própria Shopee e podem mudar). */
export function ProductPreview({ product, title, resultId, kind }: { product: ShopeeProduct; title: string; resultId: string | null; kind: ClickKind }) {
  return (
    <a
      className="product-preview"
      href={product.url}
      target="_blank"
      rel="noopener noreferrer sponsored nofollow"
      onClick={() => trackClick({ resultId, title, store: 'shopee', url: product.url, kind })}
    >
      <img src={product.imageUrl} alt="" loading="lazy" width={64} height={64} />
      <span className="product-preview-body">
        <span className="product-preview-name">{product.name}</span>
        <span className="product-preview-meta">
          <strong>{brl.format(product.price)}</strong> na Shopee
          {product.rating ? (
            <span className="product-preview-rating">
              <Star size={12} aria-hidden="true" /> {product.rating.toFixed(1)}
            </span>
          ) : null}
        </span>
      </span>
    </a>
  )
}

type Props = { item: GiftItem; resultId: string | null; index: number; name: string }

export default function GiftCard({ item, resultId, index, name }: Props) {
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
        <span className="gift-card-emoji" aria-hidden="true">
          {item.emoji}
        </span>
        <div className="gift-card-tags">
          <span className="tag">{item.category}</span>
          {showKind(item) && <span className="tag tag-alt">{KIND_LABEL[item.kind]}</span>}
        </div>
      </div>
      <h3 className="gift-card-title">{item.title}</h3>
      {item.description && <p className="gift-card-desc">{personalize(item.description, name)}</p>}
      {item.why && (
        <p className="gift-card-why">
          <strong>Por que combina:</strong> {personalize(item.why, name)}
        </p>
      )}
      <div className="gift-card-price" title="Faixa de preço estimada pela IA. Confira o valor na loja.">
        <span className="price-label">Estimativa</span> {formatPrice(item.priceMin, item.priceMax)}
      </div>
      {item.product && <ProductPreview product={item.product} title={item.title} resultId={resultId} kind="suggestion" />}
      <StoreButtons stores={item.stores} title={item.title} resultId={resultId} kind="suggestion" hasProduct={Boolean(item.product)} />
    </motion.article>
  )
}
