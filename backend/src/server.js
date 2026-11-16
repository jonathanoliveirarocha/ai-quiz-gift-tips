import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import helmet from 'helmet';
import { config } from './config.js';
import { connectDatabase, closeDatabase } from './db.js';
import { api } from './routes.js';

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'img-src': ["'self'", 'data:', 'https:'],
      },
    },
  }),
);
app.use(express.json({ limit: '50kb' }));

app.use('/api', api);
app.use('/api', (req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));

// Em produção (npm run prod), o próprio backend serve o frontend compilado.
const indexHtml = path.join(config.frontendDist, 'index.html');
if (fs.existsSync(indexHtml)) {
  app.use(express.static(config.frontendDist, { index: false }));
  app.use((req, res, next) => (req.method === 'GET' ? res.sendFile(indexHtml) : next()));
}

app.use((err, req, res, next) => {
  const status = err.status ?? (err.name === 'ValidationError' ? 400 : err.code === 11000 ? 409 : 500);
  if (status >= 500) console.error('[erro]', err);
  const message =
    err.code === 11000 ? 'Já existe um produto com esse link.' : status < 500 || err.status ? err.message : 'Erro interno. Tente de novo.';
  res.status(status).json({ error: message });
});

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
