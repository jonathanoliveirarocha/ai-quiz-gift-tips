// Ajusta os dados antigos às regras de privacidade atuais. Rode uma vez depois do deploy:
//   npm run migrate:privacy
// - Tira dos resultados salvos o nome e os textos livres (o que evitar, algo especial, outro interesse).
// - Troca o nome que a IA escreveu nos textos pelo marcador {nome}.
// - Define o prazo de exclusão automática (RESULT_TTL_DAYS, padrão 180 dias; no mínimo 30 dias a partir de hoje).
// - Converte o campo antigo `result` dos cliques para `resultId`.
// Pode ser rodado mais de uma vez sem problema.
import mongoose from 'mongoose';
import { connectDatabase, closeDatabase, isDbReady } from '../src/db.js';
import { config } from '../src/config.js';
import { Click, QuizResult } from '../src/models.js';
import { storableAnswers } from '../src/services/answers.js';

const DAY = 24 * 60 * 60 * 1000;
const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function replaceDeep(value, pattern) {
  if (typeof value === 'string') return value.replace(pattern, '{nome}');
  if (Array.isArray(value)) return value.map((v) => replaceDeep(v, pattern));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, replaceDeep(v, pattern)]));
  return value;
}

await connectDatabase();
if (!isDbReady()) {
  console.error('Sem conexão com o MongoDB.');
  process.exit(1);
}

let results = 0;
const cursor = QuizResult.find({
  $or: [
    { 'answers.name': { $exists: true } },
    { 'answers.avoid': { $exists: true } },
    { 'answers.special': { $exists: true } },
    { 'answers.otherInterest': { $exists: true } },
    { expiresAt: { $exists: false } },
  ],
})
  .lean()
  .cursor();

for await (const doc of cursor) {
  const name = typeof doc.answers?.name === 'string' ? doc.answers.name.trim() : '';
  const pattern = name.length >= 2 ? new RegExp(`(?<![\\p{L}\\p{N}])${escape(name)}(?![\\p{L}\\p{N}])`, 'gu') : null;
  const answers = Object.fromEntries(
    Object.entries(storableAnswers({ ...doc.answers, hasName: doc.answers?.hasName ?? Boolean(name) })).filter(([, v]) => v !== undefined && v !== null),
  );
  const expiresAt = new Date(Math.max(new Date(doc.createdAt).getTime() + config.resultTtlDays * DAY, Date.now() + 30 * DAY));
  await QuizResult.updateOne(
    { _id: doc._id },
    { $set: { answers, result: pattern ? replaceDeep(doc.result, pattern) : doc.result, expiresAt: doc.expiresAt ?? expiresAt } },
  );
  results++;
}

const legacyClicks = await Click.collection.updateMany({ result: { $exists: true } }, [
  { $set: { resultId: { $toString: '$result' } } },
  { $unset: 'result' },
]);

console.log(`${results} resultado(s) ajustado(s); ${legacyClicks.modifiedCount} clique(s) convertido(s).`);
await mongoose.connection.syncIndexes().catch((err) => console.warn('Índices:', err.message));
await closeDatabase();
