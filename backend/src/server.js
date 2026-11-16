// Servidor local (start.bat / npm run dev / npm run prod). Na Vercel quem roda é api/index.js.
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import { app } from './app.js';
import { config } from './config.js';
import { connectDatabase, closeDatabase } from './db.js';

// Em produção local (npm run prod), o próprio backend serve o frontend compilado.
const indexHtml = path.join(config.frontendDist, 'index.html');
if (fs.existsSync(indexHtml)) {
  app.use(express.static(config.frontendDist, { index: false }));
  app.use((req, res, next) => (req.method === 'GET' ? res.sendFile(indexHtml) : next()));
}

const server = app.listen(config.port, () => {
  console.log(`[api] Backend rodando em http://localhost:${config.port}`);
  console.log(
    config.geminiApiKey
      ? `[ia] Gemini ativo (modelo ${config.geminiModel})`
      : '[ia] Sem GEMINI_API_KEY: rodando em MODO DEMONSTRAÇÃO. Coloque a chave em backend/.env.',
  );
});

connectDatabase();

async function shutdown() {
  server.close();
  await closeDatabase();
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
