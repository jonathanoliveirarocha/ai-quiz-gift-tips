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

/** Produto real da Shopee (API oficial de afiliados), quando disponível. */
export type ShopeeProduct = { name: string; imageUrl: string; price: number; url: string; rating: number | null; sales: number | null }

export type StoreLinksItem = { query: string; stores: StoreLink[]; product: ShopeeProduct | null }

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
  /** Preenchido no navegador quando a API da Shopee encontra um produto real. */
  product?: ShopeeProduct | null
}

export type GiftResult = {
  profile: { archetype: string; summary: string; emoji: string }
  idealGift: GiftItem
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
  /** ia = gerado pela IA; acervo = ideias do acervo próprio (IA indisponível); demo = sem chave de IA. */
  mode: 'ia' | 'acervo' | 'demo'
  createdAt: string
  /** Respostas não identificáveis guardadas no servidor (sem nome nem textos livres). */
  answers: Partial<Answers>
  result: GiftResult
  catalog: CatalogProduct[]
  /** false quando "Quero outras ideias" já usou o limite de chamadas de IA deste resultado. */
  canMore?: boolean
}

export type ClickKind = 'ideal' | 'suggestion' | 'catalog' | 'guide'
