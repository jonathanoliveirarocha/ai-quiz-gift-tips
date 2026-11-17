import { Router } from 'express';
import mongoose from 'mongoose';
import { rateLimit } from 'express-rate-limit';
import { config } from './config.js';
import { isDbReady } from './db.js';
import { QuizResult, Product, Click } from './models.js';
import { parseAnswers, parseExclude } from './services/answers.js';
import { generateWithGemini } from './services/gemini.js';
import { generateDemo } from './services/demo.js';
import { normalizeResult, withStoreLinks } from './services/result.js';
import { matchCatalog, normalizeTag, serializeProduct } from './services/catalog.js';
import { STORE_IDS } from './services/stores.js';

export const api = Router();

const aiMode = () => (config.geminiApiKey ? 'gemini' : 'demo');

const quizLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Muitas consultas seguidas. Espere alguns minutos e tente de novo.' },
});

// O banco guarda o provedor e o modelo usados (análise interna), mas a API pública só diz se foi a IA ou o modo demonstração.
const publicMode = (mode) => (mode === 'demo' ? 'demo' : 'ia');

const serializeResult = (doc) => ({
  id: String(doc._id),
  mode: publicMode(doc.mode),
  createdAt: doc.createdAt,
  answers: doc.answers,
  result: withStoreLinks(doc.result),
  catalog: doc.catalog ?? [],
});

// Público: não expõe provedor de IA, modelo nem banco (esses detalhes aparecem só nos logs do servidor).
api.get('/health', (req, res) => {
  res.json({ ok: true });
});

api.post('/quiz', quizLimiter, async (req, res, next) => {
  try {
    const { answers, error } = parseAnswers(req.body?.answers);
    if (error) return res.status(400).json({ error });
    const exclude = parseExclude(req.body?.exclude);

    const mode = aiMode();
    const raw = mode === 'gemini' ? await generateWithGemini(answers, exclude) : generateDemo(answers, exclude);
    const result = normalizeResult(raw, answers.budget);
    const catalog = await matchCatalog(result, answers).catch(() => []);
    const payload = { mode, model: mode === 'gemini' ? config.geminiModel : null, answers, result, catalog };

    if (isDbReady()) {
      const doc = await QuizResult.create(payload);
      return res.json(serializeResult(doc));
    }
    res.json({ id: null, createdAt: new Date().toISOString(), answers, result, catalog, mode: publicMode(mode) });
  } catch (err) {
    next(err);
  }
});

api.get('/results/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Resultado não encontrado.' });
    if (!isDbReady()) return res.status(503).json({ error: 'Não foi possível abrir este resultado agora. Tente de novo em instantes.' });
    const doc = await QuizResult.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: 'Resultado não encontrado.' });
    res.json(serializeResult(doc));
  } catch (err) {
    next(err);
  }
});

// Registro de cliques nos links das lojas (base para medir conversão de afiliados).
api.post('/clicks', async (req, res) => {
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = null;
    }
  }
  const { resultId, title, store, url, kind } = body ?? {};
  // Grava antes de responder: em função serverless, trabalho depois da resposta pode ser interrompido.
  if (!isDbReady() || typeof url !== 'string' || !url.startsWith('https://')) return res.status(204).end();
  const result = mongoose.isValidObjectId(resultId) ? resultId : undefined;
  await Click.create({
    result,
    title: String(title ?? '').slice(0, 160),
    store: STORE_IDS.includes(store) ? store : 'outro',
    url: url.slice(0, 1000),
    kind: ['ideal', 'suggestion', 'catalog'].includes(kind) ? kind : 'suggestion',
  }).catch(() => {});
  if (result) await QuizResult.updateOne({ _id: result }, { $inc: { clicks: 1 } }).catch(() => {});
  res.status(204).end();
});

// ---------- Administração do catálogo de produtos parceiros (afiliados) ----------
const admin = Router();

admin.use((req, res, next) => {
  if (!config.adminToken) return res.status(404).json({ error: 'Admin desativado. Defina ADMIN_TOKEN em backend/.env.' });
  if (req.get('x-admin-token') !== config.adminToken) return res.status(401).json({ error: 'Token inválido.' });
  if (!isDbReady()) return res.status(503).json({ error: 'Banco de dados indisponível.' });
  next();
});

export function productInput(body) {
  const data = {
    title: body?.title,
    description: body?.description,
    imageUrl: body?.imageUrl,
    price: body?.price,
    store: body?.store,
    url: body?.url,
    tags: Array.isArray(body?.tags) ? [...new Set(body.tags.map(normalizeTag).filter(Boolean))] : undefined,
    active: body?.active,
    priority: body?.priority,
  };
  for (const key of ['url', 'imageUrl']) {
    if (data[key] && !/^https:\/\//.test(data[key])) throw Object.assign(new Error(`${key} precisa começar com https://`), { status: 400 });
  }
  return Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
}

admin.get('/products', async (req, res, next) => {
  try {
    const products = await Product.find().sort({ updatedAt: -1 }).limit(500).lean();
    res.json(products.map((p) => ({ ...serializeProduct(p), tags: p.tags, active: p.active, priority: p.priority })));
  } catch (err) {
    next(err);
  }
});

admin.post('/products', async (req, res, next) => {
  try {
    const product = await Product.create(productInput(req.body));
    res.status(201).json(serializeProduct(product));
  } catch (err) {
    next(err);
  }
});

admin.put('/products/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Produto não encontrado.' });
    const product = await Product.findByIdAndUpdate(req.params.id, productInput(req.body), { returnDocument: 'after', runValidators: true });
    if (!product) return res.status(404).json({ error: 'Produto não encontrado.' });
    res.json(serializeProduct(product));
  } catch (err) {
    next(err);
  }
});

admin.delete('/products/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Produto não encontrado.' });
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

admin.get('/stats', async (req, res, next) => {
  try {
    const [results, clicks, byStore] = await Promise.all([
      QuizResult.countDocuments(),
      Click.countDocuments(),
      Click.aggregate([{ $group: { _id: '$store', clicks: { $sum: 1 } } }, { $sort: { clicks: -1 } }]),
    ]);
    res.json({ results, clicks, byStore });
  } catch (err) {
    next(err);
  }
});

api.use('/admin', admin);
