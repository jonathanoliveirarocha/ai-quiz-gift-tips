export type Pronoun = 'ela' | 'ele' | 'neutro'

export type Budget = { label: string; min: number; max: number | null }

export type Answers = {
  name: string
  pronoun: Pronoun
  relationship: string
  age: string
  occasion: string
  budget: Budget | null
  personality: string[]
  interests: string[]
  otherInterest: string
  perfectSaturday: string
  style: { practicalSentimental: number; classicBold: number; objectExperience: number }
  avoid: string
  special: string
}

export type StoreLink = { store: string; name: string; url: string; affiliate: boolean }

export type GiftItem = {
  title: string
  description: string
  why: string
  emoji: string
  category: string
  kind: 'produto' | 'experiencia' | 'personalizado' | 'assinatura'
  priceMin: number | null
  priceMax: number | null
  query: string
  stores: StoreLink[]
}

export type GiftResult = {
  profile: { archetype: string; summary: string; emoji: string }
  idealGift: GiftItem & { confidence: number }
  suggestions: GiftItem[]
  cardMessage: string
  deliveryTip: string
  avoid: string[]
  tags: string[]
}

export type CatalogProduct = {
  id: string
  title: string
  description: string
  imageUrl: string
  price?: number
  store: string
  storeName: string
  url: string
}

export type QuizResponse = {
  id: string | null
  mode: 'gemini' | 'demo'
  model: string | null
  createdAt: string
  answers: Answers
  result: GiftResult
  catalog: CatalogProduct[]
}

export type Health = {
  ok: boolean
  ai: 'gemini' | 'demo'
  model: string | null
  db: { state: string; mode: string | null }
}

export type ClickKind = 'ideal' | 'suggestion' | 'catalog'
