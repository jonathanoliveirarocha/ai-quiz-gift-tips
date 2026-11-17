import type { GiftItem } from '../types.ts'

export const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2, minimumFractionDigits: 0 })
const brlRound = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

export function formatPrice(min: number | null, max: number | null) {
  if (min && max) return min === max ? brlRound.format(min) : `${brlRound.format(min)} a ${brlRound.format(max)}`
  if (min) return `a partir de ${brlRound.format(min)}`
  if (max) return `até ${brlRound.format(max)}`
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
