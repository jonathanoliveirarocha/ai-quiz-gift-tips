import path from 'node:path';

const backendDir = path.resolve(import.meta.dirname, '..');

try {
  process.loadEnvFile(path.join(backendDir, '.env'));
} catch {
  // Sem .env: usa os valores padrão abaixo.
}

const env = (name, fallback = '') => process.env[name]?.trim() || fallback;

export const config = {
  port: Number(env('PORT', '3001')),
  frontendDist: path.resolve(backendDir, '..', 'frontend', 'dist'),
  geminiApiKey: env('GEMINI_API_KEY'),
  geminiModel: env('GEMINI_MODEL', 'gemini-3.5-flash-lite'),
  mongoUri: env('MONGODB_URI', 'mongodb://127.0.0.1:27017/presente-certo'),
  embeddedMongo: env('MONGODB_EMBEDDED', 'true') !== 'false',
  embeddedDbPath: path.join(backendDir, '.data', 'db'),
  adminToken: env('ADMIN_TOKEN'),
  amazonTag: env('AMAZON_ASSOCIATE_TAG'),
  affiliateTemplate: (storeId) => env(`AFFILIATE_TEMPLATE_${storeId.toUpperCase()}`),
};
