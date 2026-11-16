import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    // Lido por scripts/prerender.mjs para pré-carregar o arquivo de cada guia; apagado depois.
    manifest: true,
  },
  server: {
    port: 5173,
    open: true,
  },
})
