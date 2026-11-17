// Todas as páginas institucionais com o texto completo. Usado só no build (pré-renderização e SEO).
import type { LegalPage } from './types.ts'
import sobre from './sobre.ts'
import privacidade from './privacidade.ts'
import termos from './termos.ts'

export const LEGAL_PAGES: LegalPage[] = [sobre, privacidade, termos]
