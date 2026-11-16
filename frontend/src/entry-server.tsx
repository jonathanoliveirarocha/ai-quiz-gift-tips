// Usado só no build (scripts/prerender.mjs) para gerar o HTML de cada página.
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'
import { GUIDES } from './content/guides/index.ts'
import { GUIDE_LINKS, registerGuides } from './content/guides/registry.ts'

export { sitePages, headTags } from './seo.ts'
export { routeKey } from './routes.ts'
export { GUIDES, GUIDE_LINKS }

registerGuides(GUIDES)

export function render(path: string) {
  return renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  )
}
