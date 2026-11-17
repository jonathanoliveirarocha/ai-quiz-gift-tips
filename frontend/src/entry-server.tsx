// Usado só no build (scripts/prerender.mjs) para gerar o HTML de cada página.
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'
import { GUIDES } from './content/guides/index.ts'
import { GUIDE_LINKS, registerGuides } from './content/guides/registry.ts'
import { LEGAL_PAGES } from './content/legal/index.ts'
import { LEGAL_LINKS, registerLegalPages } from './content/legal/registry.ts'
import { hasOwnerPlaceholders } from './content/legal/owner.ts'

export { sitePages, headTags } from './seo.ts'
export { routeKey } from './routes.ts'
export { GUIDES, GUIDE_LINKS, LEGAL_LINKS, hasOwnerPlaceholders }

registerGuides(GUIDES)
registerLegalPages(LEGAL_PAGES)

export function render(path: string) {
  return renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  )
}
