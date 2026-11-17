/** Página institucional (privacidade, termos, quem somos). Texto simples, sem HTML nem markdown. */
export type LegalSection = {
  heading: string
  paragraphs: string[]
  /** Lista opcional exibida depois dos parágrafos. */
  items?: string[]
}

export type LegalPage = {
  /** Caminho da página, sem barra: /privacidade */
  slug: string
  /** <title> com até 60 caracteres. */
  title: string
  /** Meta description com 120 a 160 caracteres. */
  description: string
  h1: string
  /** Data da última atualização (AAAA-MM-DD). */
  updated: string
  /** Parágrafo de abertura. */
  intro: string
  sections: LegalSection[]
}
