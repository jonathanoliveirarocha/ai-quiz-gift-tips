// Gera o HTML final de cada página depois do `vite build`:
// conteúdo já renderizado (o Google e as prévias de link leem sem rodar JavaScript),
// meta tags, Open Graph e JSON-LD de cada página, sitemap.xml e robots.txt.
import { readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const serverDir = path.join(root, 'dist-server')

// URL pública usada no canonical, no sitemap e nas imagens de prévia: o domínio do Mimo Certo.
// Para testar localmente ou mudar de domínio (ex.: mimocerto.com.br), defina SITE_URL.
const PRODUCTION_URL = 'https://mimocerto.vercel.app'
const siteUrl = () => (process.env.SITE_URL || PRODUCTION_URL).replace(/\/+$/, '')

const site = siteUrl()
const { render, sitePages, headTags, routeKey, GUIDES, GUIDE_LINKS, LEGAL_LINKS, hasOwnerPlaceholders } = await import(pathToFileURL(path.join(serverDir, 'entry-server.js')).href)
const template = await readFile(path.join(dist, 'index.html'), 'utf8')

// A lista leve (registry.ts) precisa refletir os guias completos (index.ts).
const fromGuides = GUIDES.map((g) => `${g.slug}|${g.label}|${g.emoji}`)
const fromLinks = GUIDE_LINKS.map((l) => `${l.slug}|${l.label}|${l.emoji}`)
if (fromGuides.join('\n') !== fromLinks.join('\n')) {
  const diff = [...fromGuides.filter((x) => !fromLinks.includes(x)), ...fromLinks.filter((x) => !fromGuides.includes(x))]
  throw new Error(`[prerender] GUIDE_LINKS (registry.ts) diferente dos guias em index.ts: ${diff.join(', ') || 'ordem diferente'}`)
}

// Arquivo JavaScript de cada guia, para pré-carregar junto com a página.
const manifest = JSON.parse(await readFile(path.join(dist, '.vite', 'manifest.json'), 'utf8'))
const guideChunk = (slug) => manifest[`src/content/guides/${slug}.ts`]?.file
const legalChunk = (slug) => {
  const link = LEGAL_LINKS.find((l) => l.slug === slug)
  return link ? manifest[`src/content/legal/${link.file}.ts`]?.file : undefined
}

const HEAD = /<!--app-head-->[\s\S]*?<!--\/app-head-->/
if (!HEAD.test(template) || !template.includes('<div id="root"><!--app-html--></div>')) {
  throw new Error('[prerender] index.html sem os marcadores <!--app-head--> e <!--app-html-->.')
}

const pages = sitePages(site)
const warnings = []
const seen = { title: new Map(), description: new Map() }

for (const page of pages) {
  const html = render(page.renderPath)
  if (!html || html.length < 200) throw new Error(`[prerender] HTML vazio em ${page.renderPath}`)

  if (page.index) {
    if (page.title.length > 60) warnings.push(`title com ${page.title.length} caracteres em ${page.path}`)
    if (page.description.length < 110 || page.description.length > 165)
      warnings.push(`description com ${page.description.length} caracteres em ${page.path}`)
    for (const field of ['title', 'description']) {
      const other = seen[field].get(page[field])
      if (other) warnings.push(`${field} repetido em ${other} e ${page.path}`)
      seen[field].set(page[field], page.path)
    }
  }

  const slug = page.path?.slice(1)
  const chunk = slug && (guideChunk(slug) ?? legalChunk(slug))
  if (slug && GUIDE_LINKS.some((l) => l.slug === slug) && !chunk) throw new Error(`[prerender] arquivo do guia ${slug} não encontrado no build`)
  const head =
    headTags(page, site, { googleVerification: process.env.GOOGLE_SITE_VERIFICATION }) +
    (chunk ? `\n    <link rel="modulepreload" crossorigin href="/${chunk}" />` : '')
  // Páginas só do navegador recebem data-route="client": o React sempre as renderiza do zero.
  const route = page.clientOnly ? 'client' : routeKey(page.renderPath)
  const output = template
    .replace(HEAD, () => head)
    .replace('<div id="root"><!--app-html--></div>', () => `<div id="root" data-route="${route}">${html}</div>`)
  await writeFile(path.join(dist, page.file), output)
}

const indexable = pages.filter((p) => p.index && p.path)

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${indexable
  .map(
    (p) => `  <url>
    <loc>${site}${p.path}</loc>${p.lastmod ? `\n    <lastmod>${p.lastmod}</lastmod>` : ''}
    <image:image><image:loc>${site}${p.image}</image:loc></image:image>
  </url>`,
  )
  .join('\n')}
</urlset>
`
await writeFile(path.join(dist, 'sitemap.xml'), sitemap)

await writeFile(
  path.join(dist, 'robots.txt'),
  `User-agent: *
Allow: /

Sitemap: ${site}/sitemap.xml
`,
)

await rm(serverDir, { recursive: true, force: true })
await rm(path.join(dist, '.vite'), { recursive: true, force: true })

console.log(`[prerender] ${pages.length} páginas geradas para ${site} (${indexable.length} no sitemap).`)
if (hasOwnerPlaceholders()) {
  warnings.push('preencha os dados do responsável em frontend/src/content/legal/owner.ts: a Política de Privacidade e os Termos estão com campos entre colchetes.')
}
for (const w of warnings) console.warn(`[prerender] atenção: ${w}`)
