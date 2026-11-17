import mongoose from 'mongoose';
import { config } from './config.js';
import { STORE_IDS } from './services/stores.js';

const { Schema } = mongoose;
const days = (n) => n * 24 * 60 * 60;

// Resultado do quiz. Guarda só respostas não identificáveis (sem nome nem textos livres) e some sozinho em `expiresAt`.
const quizResultSchema = new Schema(
  {
    // Código público e aleatório do link /r/:id (o _id do Mongo é previsível e não é exposto em links novos).
    publicId: { type: String, unique: true, sparse: true },
    answers: { type: Schema.Types.Mixed, required: true },
    result: { type: Schema.Types.Mixed, required: true },
    catalog: { type: [Schema.Types.Mixed], default: [] },
    // gemini = IA; acervo = ideias do acervo próprio (IA indisponível ou no limite); demo = sem chave de IA.
    mode: { type: String, enum: ['gemini', 'acervo', 'demo'], required: true },
    model: String,
    channel: { type: String, default: 'direto' },
    parentId: String,
    moreCount: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    reports: { type: Number, default: 0 },
    hidden: { type: Boolean, default: false },
    expiresAt: Date,
  },
  { timestamps: true },
);
quizResultSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Produtos parceiros com link de afiliado, cadastrados via /api/admin ou npm run import:catalog.
const productSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, trim: true, maxlength: 600, default: '' },
    imageUrl: { type: String, trim: true, default: '' },
    price: { type: Number, min: 0 },
    store: { type: String, enum: STORE_IDS, required: true },
    url: { type: String, required: true, trim: true, unique: true },
    tags: { type: [String], index: true, default: [] },
    active: { type: Boolean, default: true },
    priority: { type: Number, min: 1, max: 10, default: 1 },
  },
  { timestamps: true },
);

// Clique num botão de loja (sem IP nem dado pessoal).
const clickSchema = new Schema(
  {
    resultId: String,
    title: String,
    store: String,
    url: String,
    kind: { type: String, enum: ['ideal', 'suggestion', 'catalog', 'guide'] },
    channel: { type: String, default: 'direto' },
    page: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
clickSchema.index({ createdAt: 1 }, { expireAfterSeconds: days(config.metricsTtlDays) });
clickSchema.index({ channel: 1, createdAt: -1 });

// Evento anônimo de uso (funil). `session` é um código aleatório criado no navegador e perdido ao fechar a aba.
export const EVENT_TYPES = [
  'visit',
  'quiz_start',
  'step',
  'quiz_submit',
  'result_view',
  'result_error',
  'fallback_shown',
  'more_ideas',
  'share',
  'report',
  'guide_cta',
];
const eventSchema = new Schema(
  {
    type: { type: String, enum: EVENT_TYPES, required: true },
    step: Number,
    channel: { type: String, default: 'direto' },
    session: String,
    page: String,
    resultId: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
eventSchema.index({ createdAt: 1 }, { expireAfterSeconds: days(config.metricsTtlDays) });
eventSchema.index({ type: 1, createdAt: -1 });

// Registro de acesso exigido pelo Marco Civil (art. 15): IP, data e hora de cada envio de quiz, sob sigilo.
const accessLogSchema = new Schema({
  ip: String,
  resultId: String,
  at: { type: Date, default: Date.now },
});
accessLogSchema.index({ at: 1 }, { expireAfterSeconds: days(config.accessLogTtlDays) });

// Contador com prazo (limite de requisições, alertas). Compartilhado entre as instâncias serverless.
const counterSchema = new Schema({ _id: String, count: { type: Number, default: 0 }, expiresAt: Date }, { versionKey: false });
counterSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Uso diário (custo de IA e saúde da operação).
const usageSchema = new Schema(
  {
    _id: String, // AAAA-MM-DD
    day: Date,
    aiCalls: { type: Number, default: 0 },
    aiFailures: { type: Number, default: 0 },
    fallbacks: { type: Number, default: 0 },
    quizzes: { type: Number, default: 0 },
  },
  { versionKey: false },
);
usageSchema.index({ day: 1 }, { expireAfterSeconds: days(400) });

// Produtos da Shopee por termo de busca (API oficial), guardados por algumas horas.
const shopeeCacheSchema = new Schema({ _id: String, items: Schema.Types.Mixed, expiresAt: Date }, { versionKey: false });
shopeeCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const QuizResult = mongoose.model('QuizResult', quizResultSchema);
export const Product = mongoose.model('Product', productSchema);
export const Click = mongoose.model('Click', clickSchema);
export const Event = mongoose.model('Event', eventSchema);
export const AccessLog = mongoose.model('AccessLog', accessLogSchema);
export const Counter = mongoose.model('Counter', counterSchema);
export const Usage = mongoose.model('Usage', usageSchema);
export const ShopeeCache = mongoose.model('ShopeeCache', shopeeCacheSchema);
