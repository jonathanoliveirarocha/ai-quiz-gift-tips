import { Router } from 'express';
import mongoose from 'mongoose';
import { config } from './config.js';
import { isDbReady } from './db.js';
import { AccessLog, Click, Event, EVENT_TYPES, Product, QuizResult, Usage } from './models.js';
import { parseAnswers, parseExclude, storableAnswers } from './services/answers.js';
import { generateGifts } from './services/generate.js';
import { withStoreLinks } from './services/result.js';
import { matchCatalog, normalizeTag, serializeProduct } from './services/catalog.js';
import { ACTIVE_STORE_IDS, STORE_IDS, affiliateWarnings, buildStoreLinks } from './services/stores.js';
import { findShopeeProducts, shopeeApiEnabled } from './services/shopee.js';
import { addUsage, alert, usageToday } from './services/ops.js';
import { cleanChannel, hit, ipKey, randomId, rateLimit, safeEqual, verifyTurnstile } from './services/security.js';

export const api = Router();

const MIN = 60 * 1000;
const PUBLIC_MODE = { gemini: 'ia', acervo: 'acervo', demo: 'demo' };
const PUBLIC_ID = /^[A-Za-z0-9_-]{22}$/;

/** Corpo de requisições enviadas por navigator.sendBeacon (text/plain). */
const jsonBody = (req) => {
  if (typeof req.body !== 'string') return req.body ?? {};
  try {
    return JSON.parse(req.body);
  } catch {
    return {};
  }
};
const shortText = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

// Respostas antigas podiam ter nome e textos livres: só as chaves não identificáveis saem na API.
const PUBLIC_ANSWER_KEYS = ['hasName', 'pronoun', 'relationship', 'age', 'occasion', 'budget', 'personality', 'interests', 'perfectSaturday', 'style'];
const publicAnswers = (answers = {}) => Object.fromEntries(PUBLIC_ANSWER_KEYS.filter((k) => k in answers).map((k) => [k, answers[k]]));

const serializeResult = (doc, channel) => ({
  id: doc.publicId ?? String(doc._id),
  mode: PUBLIC_MODE[doc.mode] ?? 'ia',
  createdAt: doc.createdAt,
  answers: publicAnswers(doc.answers),
  result: withStoreLinks(doc.result, channel),
  catalog: doc.catalog ?? [],
  canMore: (doc.moreCount ?? 0) < config.maxMoreIdeas,
});

/** Busca por código público (links novos) ou pelo _id (links antigos, criados antes do código público). */
function findResult(id) {
  if (PUBLIC_ID.test(id)) return QuizResult.findOne({ publicId: id });
  if (mongoose.isValidObjectId(id) && /^[a-f\d]{24}$/i.test(id)) return QuizResult.findById(id);
  return null;
}

// Público: só diz se a API e o banco respondem (detalhes ficam no painel, com token).
api.get('/health', (req, res) => {
  const ok = isDbReady();
  res.status(ok ? 200 : 503).json({ ok });
});

api.post(
  '/quiz',
  rateLimit('quiz', config.quizLimitPer15Min, 15 * MIN, 'Muitas consultas seguidas. Espere alguns minutos e tente de novo.'),
  async (req, res, next) => {
    try {
      if (!(await verifyTurnstile(req.body?.turnstileToken, req.ip))) {
        return res.status(403).json({ error: 'Não conseguimos confirmar que você não é um robô. Recarregue a página e tente de novo.' });
      }
      const { answers, error } = parseAnswers(req.body?.answers);
      if (error) return res.status(400).json({ error });
      const exclude = parseExclude(req.body?.exclude);
      const channel = cleanChannel(req.body?.channel);

      // "Quero outras ideias": depois de MAX_MORE_IDEAS vezes, as novas ideias vêm do acervo (sem custo de IA).
      const parentId = shortText(req.body?.parentId, 40);
      const parent = parentId && isDbReady() ? await findResult(parentId)?.lean() : null;
      const allowAi = !parent || (parent.moreCount ?? 0) < config.maxMoreIdeas;

      const { result, mode, model } = await generateGifts(answers, exclude, { channel, allowAi });
      const catalog = await matchCatalog(result, answers).catch(() => []);
      await addUsage({ quizzes: 1 });

      const publicId = randomId(16);
      const createdAt = new Date();
      const stored = storableAnswers(answers);
      let saved = false;

      if (isDbReady()) {
        try {
          await QuizResult.create({
            publicId,
            answers: stored,
            result,
            catalog,
            mode,
            model,
            channel,
            parentId: parent ? (parent.publicId ?? String(parent._id)) : undefined,
            expiresAt: new Date(createdAt.getTime() + config.resultTtlDays * 24 * 60 * MIN),
          });
          saved = true;
          if (parent) await QuizResult.updateOne({ _id: parent._id }, { $inc: { moreCount: 1 } }).catch(() => {});
          if (config.accessLog) await AccessLog.create({ ip: req.ip, resultId: publicId }).catch(() => {});
        } catch (err) {
          // Banco cheio ou fora do ar: entrega o resultado mesmo assim (só sem link de compartilhamento).
          console.error('[db] falha ao salvar resultado:', err.message);
          alert('banco-gravacao', `Não foi possível salvar um resultado no banco (${err.message}). O quiz segue funcionando, mas sem link de compartilhamento.`);
        }
      }

      res.json({
        id: saved ? publicId : null,
        mode: PUBLIC_MODE[mode],
        createdAt,
        answers: stored,
        result,
        catalog,
        canMore: !parent || (parent.moreCount ?? 0) + 1 < config.maxMoreIdeas,
      });
    } catch (err) {
      next(err);
    }
  },
);

api.get('/results/:id', rateLimit('results', 120, 10 * MIN), async (req, res, next) => {
  try {
    if (!isDbReady()) return res.status(503).json({ error: 'Não foi possível abrir este resultado agora. Tente de novo em instantes.' });
    const doc = await findResult(req.params.id)?.lean();
    if (!doc) return res.status(404).json({ error: 'Resultado não encontrado. Ele pode ter expirado ou sido apagado.' });
    if (doc.hidden) return res.status(410).json({ error: 'Este resultado foi removido depois de denúncias.' });
    res.json(serializeResult(doc, cleanChannel(req.query.canal)));
  } catch (err) {
    next(err);
  }
});

// Denúncia de conteúdo impróprio: com 2 denúncias de pessoas diferentes, o resultado sai do ar.
api.post('/results/:id/report', rateLimit('report', 10, 60 * MIN), async (req, res, next) => {
  try {
    if (!isDbReady()) return res.status(204).end();
    const doc = await findResult(req.params.id)?.lean();
    if (!doc) return res.status(204).end();
    const first = (await hit(`denuncia:${doc._id}:${ipKey(req)}`, 30 * 24 * 60 * MIN)) === 1;
    if (first) {
      const updated = await QuizResult.findOneAndUpdate({ _id: doc._id }, { $inc: { reports: 1 } }, { returnDocument: 'after', lean: true });
      if (updated.reports >= 2 && !updated.hidden) {
        await QuizResult.updateOne({ _id: doc._id }, { hidden: true });
        alert('denuncia', `Um resultado foi ocultado depois de ${updated.reports} denúncias (id ${doc.publicId ?? doc._id}).`);
      }
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// Links de afiliado (e produto da Shopee, se a API estiver ativa) para uma lista de termos.
// Usado pelos guias e para enriquecer o resultado com foto e preço reais.
api.post('/links', rateLimit('links', 120, 10 * MIN), async (req, res, next) => {
  try {
    const body = jsonBody(req);
    const channel = cleanChannel(body.channel);
    const money = (v) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : null);
    const items = (Array.isArray(body.items) ? body.items : [])
      .slice(0, 30)
      .map((i) => ({ query: shortText(i?.query, 80), min: money(i?.min), max: money(i?.max) }))
      .filter((i) => i.query);
    const products = await findShopeeProducts(items);
    res.json({
      items: items.map((item, i) => {
        const stores = buildStoreLinks(item.query, channel);
        const product = products[i];
        // Com produto da Shopee, o botão leva direto ao produto (link oficial de afiliado).
        if (product) {
          const shopee = stores.find((s) => s.store === 'shopee');
          if (shopee) Object.assign(shopee, { url: product.url, affiliate: true });
        }
        return { query: item.query, stores, product };
      }),
    });
  } catch (err) {
    next(err);
  }
});

const STORE_URL = /^https:\/\//;

// Registro de cliques nos botões das lojas (base para medir conversão por canal).
api.post('/clicks', rateLimit('clicks', 120, 10 * MIN), async (req, res) => {
  const { resultId, title, store, url, kind, channel, page } = jsonBody(req);
  // Grava antes de responder: em função serverless, trabalho depois da resposta pode ser interrompido.
  if (!isDbReady() || typeof url !== 'string' || !STORE_URL.test(url)) return res.status(204).end();
  const id = shortText(resultId, 40);
  await Click.create({
    resultId: id || undefined,
    title: shortText(title, 160),
    store: STORE_IDS.includes(store) ? store : 'outro',
    url: url.slice(0, 1000),
    kind: ['ideal', 'suggestion', 'catalog', 'guide'].includes(kind) ? kind : 'suggestion',
    channel: cleanChannel(channel),
    page: shortText(page, 80) || undefined,
  }).catch(() => {});
  if (PUBLIC_ID.test(id)) await QuizResult.updateOne({ publicId: id }, { $inc: { clicks: 1 } }).catch(() => {});
  res.status(204).end();
});

// Eventos anônimos de uso (funil do quiz).
api.post('/events', rateLimit('events', 300, 10 * MIN), async (req, res) => {
  const { type, step, channel, session, page, resultId } = jsonBody(req);
  if (!isDbReady() || !EVENT_TYPES.includes(type)) return res.status(204).end();
  const stepNumber = Number.isInteger(step) && step >= 0 && step <= 30 ? step : undefined;
  await Event.create({
    type,
    step: stepNumber,
    channel: cleanChannel(channel),
    session: /^[A-Za-z0-9_-]{8,40}$/.test(session ?? '') ? session : undefined,
    page: shortText(page, 80) || undefined,
    resultId: shortText(resultId, 40) || undefined,
  }).catch(() => {});
  res.status(204).end();
});

// ---------- Administração (painel e catálogo de produtos parceiros) ----------
const admin = Router();

admin.use(rateLimit('admin', 120, 15 * MIN), (req, res, next) => {
  if (!config.adminToken) return res.status(404).json({ error: 'Admin desativado. Defina ADMIN_TOKEN nas variáveis do backend.' });
  if (!safeEqual(req.get('x-admin-token') ?? '', config.adminToken)) return res.status(401).json({ error: 'Token inválido.' });
  next();
});

const needsDb = (req, res, next) => (isDbReady() ? next() : res.status(503).json({ error: 'Banco de dados indisponível.' }));

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
  // Regras da Amazon Associados: preço só da própria Amazon (API) e nada de guardar imagens.
  if (data.store === 'amazon') {
    data.price = undefined;
    data.imageUrl = '';
  }
  for (const key of ['url', 'imageUrl']) {
    if (data[key] && !/^https:\/\//.test(data[key])) throw Object.assign(new Error(`${key} precisa começar com https://`), { status: 400 });
  }
  return Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
}

admin.get('/products', needsDb, async (req, res, next) => {
  try {
    const products = await Product.find().sort({ updatedAt: -1 }).limit(500).lean();
    res.json(products.map((p) => ({ ...serializeProduct(p), tags: p.tags, active: p.active, priority: p.priority })));
  } catch (err) {
    next(err);
  }
});

admin.post('/products', needsDb, async (req, res, next) => {
  try {
    const product = await Product.create(productInput(req.body));
    res.status(201).json(serializeProduct(product));
  } catch (err) {
    next(err);
  }
});

admin.put('/products/:id', needsDb, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Produto não encontrado.' });
    const product = await Product.findByIdAndUpdate(req.params.id, productInput(req.body), { returnDocument: 'after', runValidators: true });
    if (!product) return res.status(404).json({ error: 'Produto não encontrado.' });
    res.json(serializeProduct(product));
  } catch (err) {
    next(err);
  }
});

admin.delete('/products/:id', needsDb, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Produto não encontrado.' });
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// Pedido de exclusão recebido por e-mail (LGPD): apaga o resultado pelo código do link (/r/<código>).
admin.delete('/results/:id', needsDb, async (req, res, next) => {
  try {
    const doc = await findResult(req.params.id)?.lean();
    if (!doc) return res.status(404).json({ error: 'Resultado não encontrado.' });
    await QuizResult.deleteOne({ _id: doc._id });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

const ATLAS_FREE_MB = 512;

// Saúde detalhada da operação: o que precisa de atenção para o site seguir gerando receita.
admin.get('/health', async (req, res, next) => {
  try {
    const warnings = [...affiliateWarnings()];
    let db = { ok: isDbReady(), sizeMB: null };
    if (db.ok) {
      const stats = await mongoose.connection.db.stats().catch(() => null);
      if (stats) db.sizeMB = Math.round(((stats.dataSize ?? 0) + (stats.indexSize ?? 0)) / 1024 / 1024);
      if (db.sizeMB !== null && db.sizeMB > ATLAS_FREE_MB * 0.8) warnings.push(`Banco com ${db.sizeMB} MB: perto do limite do plano gratuito do Atlas (512 MB).`);
    } else warnings.push('Banco de dados fora do ar: resultados não estão sendo salvos.');
    const usage = await usageToday();
    if (!config.geminiApiKey) warnings.push('GEMINI_API_KEY vazia: o site está em modo demonstração.');
    if (config.maxAiCallsPerDay && usage.aiCalls >= config.maxAiCallsPerDay) warnings.push('Teto diário de IA atingido: sugestões vindo do acervo até a meia-noite.');
    if (!config.alertWebhookUrl) warnings.push('ALERT_WEBHOOK_URL vazia: você não recebe alertas quando algo falha.');
    res.json({
      db,
      ai: {
        configured: Boolean(config.geminiApiKey),
        model: config.geminiModel,
        fallbackModel: config.geminiFallbackModel,
        today: usage,
        dailyCap: config.maxAiCallsPerDay,
      },
      stores: ACTIVE_STORE_IDS,
      shopeeApi: shopeeApiEnabled(),
      antiBot: Boolean(config.turnstileSecret),
      alerts: Boolean(config.alertWebhookUrl),
      warnings,
    });
  } catch (err) {
    next(err);
  }
});

// Números do negócio: funil, canais, lojas, presentes mais clicados e uso da IA.
admin.get('/stats', needsDb, async (req, res, next) => {
  try {
    const days = Math.min(Math.max(Number.parseInt(req.query.days, 10) || 30, 1), 400);
    const since = new Date(Date.now() - days * 24 * 60 * MIN);
    const recent = { createdAt: { $gte: since } };

    // Sessões únicas por tipo de evento (e por canal).
    const sessionsBy = (group) => [
      { $match: { ...recent, session: { $exists: true } } },
      { $group: { _id: { ...group, session: '$session' } } },
      { $group: { _id: Object.fromEntries(Object.keys(group).map((k) => [k, `$_id.${k}`])), sessions: { $sum: 1 } } },
    ];

    const [byType, byChannelType, steps, clicksByChannel, clicksByStore, clicksByKind, topGifts, topPages, resultsByMode, usage] = await Promise.all([
      Event.aggregate(sessionsBy({ type: '$type' })),
      Event.aggregate(sessionsBy({ type: '$type', channel: '$channel' })),
      Event.aggregate([
        { $match: { ...recent, type: 'step', session: { $exists: true } } },
        { $group: { _id: { step: '$step', session: '$session' } } },
        { $group: { _id: '$_id.step', sessions: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Click.aggregate([{ $match: recent }, { $group: { _id: '$channel', clicks: { $sum: 1 } } }, { $sort: { clicks: -1 } }]),
      Click.aggregate([{ $match: recent }, { $group: { _id: '$store', clicks: { $sum: 1 } } }, { $sort: { clicks: -1 } }]),
      Click.aggregate([{ $match: recent }, { $group: { _id: '$kind', clicks: { $sum: 1 } } }, { $sort: { clicks: -1 } }]),
      Click.aggregate([{ $match: recent }, { $group: { _id: '$title', clicks: { $sum: 1 } } }, { $sort: { clicks: -1 } }, { $limit: 15 }]),
      Click.aggregate([{ $match: { ...recent, page: { $exists: true } } }, { $group: { _id: '$page', clicks: { $sum: 1 } } }, { $sort: { clicks: -1 } }, { $limit: 15 }]),
      QuizResult.aggregate([{ $match: recent }, { $group: { _id: '$mode', results: { $sum: 1 } } }]),
      Usage.find({ day: { $gte: since } }).sort({ _id: 1 }).lean(),
    ]);

    const funnel = Object.fromEntries(byType.map((r) => [r._id.type, r.sessions]));
    const channels = {};
    for (const r of byChannelType) {
      const c = (channels[r._id.channel] ??= { channel: r._id.channel, clicks: 0 });
      c[r._id.type] = r.sessions;
    }
    for (const r of clicksByChannel) (channels[r._id] ??= { channel: r._id, clicks: 0 }).clicks = r.clicks;
    const totalClicks = clicksByStore.reduce((sum, r) => sum + r.clicks, 0);

    res.json({
      days,
      funnel: {
        visits: funnel.visit ?? 0,
        quizStarts: funnel.quiz_start ?? 0,
        submits: funnel.quiz_submit ?? 0,
        results: funnel.result_view ?? 0,
        errors: funnel.result_error ?? 0,
        fallbacks: funnel.fallback_shown ?? 0,
        moreIdeas: funnel.more_ideas ?? 0,
        shares: funnel.share ?? 0,
        clicks: totalClicks,
      },
      steps: steps.map((s) => ({ step: s._id, sessions: s.sessions })),
      channels: Object.values(channels).sort((a, b) => (b.visit ?? 0) - (a.visit ?? 0)),
      clicksByStore: clicksByStore.map((r) => ({ store: r._id, clicks: r.clicks })),
      clicksByKind: clicksByKind.map((r) => ({ kind: r._id, clicks: r.clicks })),
      topGifts: topGifts.map((r) => ({ title: r._id, clicks: r.clicks })),
      topPages: topPages.map((r) => ({ page: r._id, clicks: r.clicks })),
      resultsByMode: Object.fromEntries(resultsByMode.map((r) => [PUBLIC_MODE[r._id] ?? r._id, r.results])),
      usage: usage.map((u) => ({ day: u._id, aiCalls: u.aiCalls, aiFailures: u.aiFailures, fallbacks: u.fallbacks, quizzes: u.quizzes })),
    });
  } catch (err) {
    next(err);
  }
});

api.use('/admin', admin);
