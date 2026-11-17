import { GUIDES } from './content/guides/index.ts'
import { LEGAL_PAGES } from './content/legal/index.ts'
import { HOME, HOME_FAQ, SITE_NAME } from './content/home.ts'
import type { Guide } from './content/types.ts'
import type { LegalPage } from './content/legal/types.ts'

/**
 * Uma página gerada no build (scripts/prerender.mjs).
 * `path` é a URL pública; `null` quando a página não deve ter canonical nem entrar no sitemap.
 */
export type PageMeta = {
  file: string
  renderPath: string
  path: string | null
  title: string
  description: string
  ogTitle: string
  ogDescription: string
  ogType: 'website' | 'article'
  image: string
  imageAlt: string
  index: boolean
  /** Página que só funciona no navegador (dados do aparelho): o HTML do build é só a moldura. */
  clientOnly?: boolean
  lastmod?: string
  jsonLd?: Record<string, unknown>
}

const OG_SIZE = { width: 1200, height: 630 }
export const ogImagePath = (name: string) => `/og/${name}.jpg`

const faqLd = (faq: { q: string; a: string }[]) => ({
  '@type': 'FAQPage',
  mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
})

function homeMeta(site: string): PageMeta {
  const url = `${site}/`
  const latest = [HOME.updated, ...GUIDES.map((g) => g.updated)].sort().at(-1)
  return {
    file: 'index.html',
    renderPath: '/',
    path: '/',
    title: HOME.title,
    description: HOME.description,
    ogTitle: HOME.ogTitle,
    ogDescription: HOME.ogDescription,
    ogType: 'website',
    image: ogImagePath('home'),
    imageAlt: 'Mimo Certo: responda sobre a pessoa e a IA indica o presente ideal',
    index: true,
    lastmod: latest,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${url}#website`,
          name: SITE_NAME,
          url,
          inLanguage: 'pt-BR',
          description: HOME.description,
          publisher: { '@id': `${url}#organization` },
        },
        {
          '@type': 'Organization',
          '@id': `${url}#organization`,
          name: SITE_NAME,
          url,
          logo: { '@type': 'ImageObject', url: `${site}/icons/icon-512.png`, width: 512, height: 512 },
        },
        {
          '@type': 'WebApplication',
          name: SITE_NAME,
          url,
          description: HOME.description,
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          browserRequirements: 'Requer JavaScript',
          inLanguage: 'pt-BR',
          isAccessibleForFree: true,
          image: `${site}${ogImagePath('home')}`,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
        },
        faqLd(HOME_FAQ),
      ],
    },
  }
}

function guideMeta(site: string, guide: Guide): PageMeta {
  const path = `/${guide.slug}`
  const url = `${site}${path}`
  const image = ogImagePath(guide.slug)
  return {
    file: `${guide.slug}.html`,
    renderPath: path,
    path,
    title: guide.title,
    description: guide.description,
    ogTitle: guide.h1,
    ogDescription: guide.description,
    ogType: 'article',
    image,
    imageAlt: `${guide.label}. ${guide.tagline}`,
    index: true,
    lastmod: guide.updated,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          '@id': `${url}#article`,
          headline: guide.h1,
          description: guide.description,
          inLanguage: 'pt-BR',
          image: { '@type': 'ImageObject', url: `${site}${image}`, ...OG_SIZE },
          datePublished: guide.updated,
          dateModified: guide.updated,
          mainEntityOfPage: url,
          author: { '@type': 'Organization', name: SITE_NAME, url: `${site}/` },
          publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: `${site}/`,
            logo: { '@type': 'ImageObject', url: `${site}/icons/icon-512.png`, width: 512, height: 512 },
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Início', item: `${site}/` },
            { '@type': 'ListItem', position: 2, name: guide.label, item: url },
          ],
        },
        faqLd(guide.faq),
      ],
    },
  }
}

function legalMeta(site: string, page: LegalPage): PageMeta {
  const path = `/${page.slug}`
  const url = `${site}${path}`
  return {
    file: `${page.slug}.html`,
    renderPath: path,
    path,
    title: page.title,
    description: page.description,
    ogTitle: page.h1,
    ogDescription: page.description,
    ogType: 'website',
    image: ogImagePath('home'),
    imageAlt: `${SITE_NAME}: ${page.h1}`,
    index: true,
    lastmod: page.updated,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': page.slug === 'quem-somos' ? 'AboutPage' : 'WebPage',
          name: page.h1,
          url,
          description: page.description,
          inLanguage: 'pt-BR',
          dateModified: page.updated,
          isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${site}/` },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Início', item: `${site}/` },
            { '@type': 'ListItem', position: 2, name: page.h1, item: url },
          ],
        },
      ],
    },
  }
}

const appShell = (slug: string, title: string): PageMeta => ({
  file: `${slug}.html`,
  renderPath: `/${slug}`,
  path: null,
  title: `${title} | ${SITE_NAME}`,
  description: 'Área do Mimo Certo que funciona no seu navegador.',
  ogTitle: HOME.ogTitle,
  ogDescription: HOME.ogDescription,
  ogType: 'website',
  image: ogImagePath('home'),
  imageAlt: SITE_NAME,
  index: false,
  clientOnly: true,
})

/** Todas as páginas que o build gera. */
export function sitePages(site: string): PageMeta[] {
  return [
    homeMeta(site),
    ...GUIDES.map((g) => guideMeta(site, g)),
    ...LEGAL_PAGES.map((p) => legalMeta(site, p)),
    appShell('painel', 'Painel'),
    {
      // Casca usada por /r/:id (vercel.json). Resultados são pessoais: nunca entram no Google.
      file: 'resultado.html',
      renderPath: '/r/000000000000000000000000',
      path: null,
      title: 'Veja o presente ideal que a IA escolheu | Mimo Certo',
      description: 'Alguém usou o Mimo Certo e a IA escolheu o presente ideal. Abra para ver a sugestão e faça o seu quiz grátis.',
      ogTitle: 'Olha o presente ideal que a IA escolheu 🎁',
      ogDescription: 'Abra para ver a sugestão, as outras ideias e a mensagem para o cartão. Depois, faça o seu quiz grátis.',
      ogType: 'website',
      image: ogImagePath('resultado'),
      imageAlt: 'Mimo Certo: o presente ideal escolhido pela IA',
      index: false,
    },
    {
      file: '404.html',
      renderPath: '/404',
      path: null,
      title: 'Página não encontrada | Mimo Certo',
      description: 'Essa página não existe. Faça o quiz grátis e descubra o presente ideal com a ajuda da IA.',
      ogTitle: HOME.ogTitle,
      ogDescription: HOME.ogDescription,
      ogType: 'website',
      image: ogImagePath('home'),
      imageAlt: 'Mimo Certo',
      index: false,
    },
  ]
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Tags do <head> de uma página. `site` é a URL de produção, sem barra no final. */
export function headTags(page: PageMeta, site: string, options: { googleVerification?: string } = {}) {
  const url = page.path ? `${site}${page.path}` : null
  const image = `${site}${page.image}`
  const tags = [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<meta name="robots" content="${page.index ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' : 'noindex, follow'}" />`,
    url && `<link rel="canonical" href="${esc(url)}" />`,
    url && `<link rel="alternate" hreflang="pt-BR" href="${esc(url)}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:type" content="${page.ogType}" />`,
    url && `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:title" content="${esc(page.ogTitle)}" />`,
    `<meta property="og:description" content="${esc(page.ogDescription)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta property="og:image:secure_url" content="${esc(image)}" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:width" content="${OG_SIZE.width}" />`,
    `<meta property="og:image:height" content="${OG_SIZE.height}" />`,
    `<meta property="og:image:alt" content="${esc(page.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(page.ogTitle)}" />`,
    `<meta name="twitter:description" content="${esc(page.ogDescription)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
    `<meta name="twitter:image:alt" content="${esc(page.imageAlt)}" />`,
    options.googleVerification && `<meta name="google-site-verification" content="${esc(options.googleVerification)}" />`,
    page.jsonLd && `<script type="application/ld+json">${JSON.stringify(page.jsonLd).replace(/</g, '\\u003c')}</script>`,
  ]
  return tags.filter(Boolean).join('\n    ')
}
