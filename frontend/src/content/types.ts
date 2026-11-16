import type { Pronoun } from '../types.ts'

/**
 * Respostas que já chegam preenchidas quando a pessoa sai do guia para o quiz.
 * Os valores precisam ser idênticos às opções de src/quiz.ts.
 */
export type GuidePreset = {
  relationship?: string
  occasion?: string
  age?: string
  /** Rótulo de uma das faixas de BUDGETS, ex.: 'Até R$ 50'. */
  budget?: string
  pronoun?: Pronoun
}

export type GuideIdea = { emoji: string; title: string; text: string }

export type Guide = {
  /** Caminho da página, sem barra: /presente-para-mae */
  slug: string
  /** <title> com até 60 caracteres e a palavra-chave principal no começo. */
  title: string
  /** Meta description com 140 a 160 caracteres. */
  description: string
  /** Nome curto usado em links, breadcrumb e na imagem de preview. Ex.: 'Presente para mãe'. */
  label: string
  /** Frase curta que aparece na imagem de preview (até 70 caracteres). */
  tagline: string
  emoji: string
  h1: string
  /** 2 ou 3 parágrafos de introdução. */
  intro: string[]
  preset: GuidePreset
  /** Texto do botão que abre o quiz. */
  cta: string
  /** "Como escolher": 4 ou 5 dicas. */
  tips: { title: string; text: string }[]
  /** 3 ou 4 grupos de ideias, cada um com 4 a 6 ideias. */
  ideas: { heading: string; intro?: string; items: GuideIdea[] }[]
  /** 4 a 6 perguntas frequentes. */
  faq: { q: string; a: string }[]
  /** 3 ou 4 slugs de outros guias. */
  related: string[]
  /** Data da última revisão do conteúdo (AAAA-MM-DD). */
  updated: string
}
