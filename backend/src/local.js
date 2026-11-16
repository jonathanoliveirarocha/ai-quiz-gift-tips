// Servidor para rodar na máquina local (npm run dev / npm start). Na Vercel, o entrypoint é src/app.js.
import { app } from './app.js';
import { config } from './config.js';
import { connectDatabase, closeDatabase } from './db.js';

const server = app.listen(config.port, () => {
  console.log(`[api] Backend rodando em http://localhost:${config.port}`);
  console.log(`[api] Origens liberadas no CORS: ${config.corsOrigins.join(', ')}`);
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
