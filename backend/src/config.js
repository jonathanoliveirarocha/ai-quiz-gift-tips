import path from 'node:path';

const backendDir = path.resolve(import.meta.dirname, '..');

try {
  process.loadEnvFile(path.join(backendDir, '.env'));
} catch {
  // Sem .env: usa os valores padrão abaixo.
}

const env = (name, fallback = '') => process.env[name]?.trim() || fallback;
const int = (name, fallback) => {
  const n = Number.parseInt(env(name), 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};
const csv = (value) =>
  value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

// "instagram=minhatag-ig-20,tiktok=minhatag-tt-20" -> { instagram: 'minhatag-ig-20', ... }
const pairs = (value) =>
  Object.fromEntries(
    csv(value)
      .map((pair) => pair.split('=').map((p) => p.trim()))
      .filter(([k, v]) => k && v)
      .map(([k, v]) => [k.toLowerCase(), v]),
  );

export const config = {
  port: Number(env('PORT', '3001')),
  // Endereços do frontend que podem chamar a API (separados por vírgula; aceita * como curinga).
  corsOrigins: csv(env('CORS_ORIGIN', 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173')).map((o) =>
    o.replace(/\/+$/, ''),
  ),

  // ---------- IA ----------
  geminiApiKey: env('GEMINI_API_KEY'),
  geminiModel: env('GEMINI_MODEL', 'gemini-3.5-flash-lite'),
  // Usado quando o modelo principal falha. "none" desliga o reserva.
  geminiFallbackModel: env('GEMINI_FALLBACK_MODEL', 'gemini-3.1-flash-lite'),
  // Tempo máximo total de espera pela IA (todas as tentativas); depois disso o acervo próprio responde.
  aiTimeBudgetMs: int('AI_TIME_BUDGET_MS', 30_000),
  // Teto de chamadas de IA por dia (protege o custo); acima dele, as sugestões vêm do acervo próprio.
  maxAiCallsPerDay: int('MAX_AI_CALLS_PER_DAY', 2000),
  // Quantas vezes "Quero outras ideias" pode chamar a IA para o mesmo resultado.
  maxMoreIdeas: int('MAX_MORE_IDEAS', 3),

  // ---------- Banco ----------
  mongoUri: env('MONGODB_URI', 'mongodb://127.0.0.1:27017/presente-certo'),
  // O MongoDB embutido só faz sentido na máquina local; na Vercel use o Atlas.
  embeddedMongo: env('MONGODB_EMBEDDED', 'true') !== 'false' && !process.env.VERCEL,
  embeddedDbPath: env('EMBEDDED_DB_PATH', path.join(backendDir, '.data', 'db')),
  // Prazos de guarda (dias). Resultados: link compartilhável. Cliques/eventos: métricas. Acesso: Marco Civil, art. 15.
  resultTtlDays: int('RESULT_TTL_DAYS', 180),
  metricsTtlDays: int('METRICS_TTL_DAYS', 395),
  accessLogTtlDays: int('ACCESS_LOG_TTL_DAYS', 183),
  accessLog: env('ACCESS_LOG', 'true') !== 'false',

  // ---------- Segurança e operação ----------
  adminToken: env('ADMIN_TOKEN'),
  // Sal usado para transformar o IP em um código nos contadores de limite (o IP em si não é guardado ali).
  ipSalt: env('IP_HASH_SALT', 'presente-certo'),
  quizLimitPer15Min: int('QUIZ_LIMIT_PER_15_MIN', 30),
  // Cloudflare Turnstile (anti-robô, opcional). Com a chave secreta definida, o quiz exige o token.
  turnstileSecret: env('TURNSTILE_SECRET_KEY'),
  // Webhook para alertas (Discord, Slack ou Telegram). Vazio = alertas só no log.
  alertWebhookUrl: env('ALERT_WEBHOOK_URL'),

  // ---------- Lojas e afiliados ----------
  // Lojas com botão em cada sugestão, na ordem dos botões. Para incluir o Mercado Livre: amazon,shopee,mercadolivre
  activeStores: csv(env('ACTIVE_STORES', 'amazon,shopee')).map((id) => id.toLowerCase()),
  amazonTag: env('AMAZON_ASSOCIATE_TAG'),
  // Uma tag por canal para saber de onde vem cada comissão. Ex.: instagram=minhatag-ig-20,tiktok=minhatag-tt-20
  amazonTagsByChannel: pairs(env('AMAZON_TRACKING_IDS')),
  affiliateTemplate: (storeId) => env(`AFFILIATE_TEMPLATE_${storeId.toUpperCase()}`),
  // API oficial de afiliados da Shopee (opcional): produtos com foto, preço e link oficial.
  shopeeAppId: env('SHOPEE_APP_ID'),
  shopeeSecret: env('SHOPEE_APP_SECRET'),
  shopeeApiUrl: env('SHOPEE_API_URL', 'https://open-api.affiliate.shopee.com.br/graphql'),
};
