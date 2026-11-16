import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config.js';
import { connectDatabase } from './db.js';
import { api } from './routes.js';

const onVercel = Boolean(process.env.VERCEL);

const escapeRegex = (text) => text.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
const allowedOrigins = config.corsOrigins.map((origin) => new RegExp(`^${escapeRegex(origin).replaceAll('*', '[^/]+')}$`));

export const app = express();

// Na Vercel, o IP real do visitante chega pelo proxy (usado pelo limite de requisições).
if (onVercel) app.set('trust proxy', 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: (origin, done) => done(null, !origin || allowedOrigins.some((re) => re.test(origin))) }));
app.use(express.json({ limit: '50kb' }));
// O registro de cliques chega via navigator.sendBeacon como text/plain (evita preflight de CORS).
app.use(express.text({ type: 'text/plain', limit: '10kb' }));

app.get('/', (req, res) => res.json({ name: 'Presente Certo API', ok: true }));

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
