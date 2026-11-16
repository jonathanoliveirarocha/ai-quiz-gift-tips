import express from 'express';
import helmet from 'helmet';
import { connectDatabase } from './db.js';
import { api } from './routes.js';

const onVercel = Boolean(process.env.VERCEL);

export const app = express();

// Na Vercel, o IP real do visitante chega pelo proxy (usado pelo limite de requisições).
if (onVercel) app.set('trust proxy', 1);

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

// Em função serverless não há "startup": garante a conexão (reaproveitada entre chamadas) antes de cada requisição.
if (onVercel) {
  app.use('/api', async (req, res, next) => {
    await connectDatabase();
    next();
  });
}

app.use('/api', api);
app.use('/api', (req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));

app.use((err, req, res, next) => {
  const status = err.status ?? (err.name === 'ValidationError' ? 400 : err.code === 11000 ? 409 : 500);
  if (status >= 500) console.error('[erro]', err);
  const message =
    err.code === 11000 ? 'Já existe um produto com esse link.' : status < 500 || err.status ? err.message : 'Erro interno. Tente de novo.';
  res.status(status).json({ error: message });
});

export default app;
