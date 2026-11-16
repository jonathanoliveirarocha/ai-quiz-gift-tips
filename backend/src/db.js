import dns from 'node:dns';
import fs from 'node:fs';
import mongoose from 'mongoose';
import { config } from './config.js';

const DB_NAME = 'presente-certo';

let status = { state: 'conectando', mode: null };
let memoryServer = null;

export const dbStatus = () => ({ ...status });
export const isDbReady = () => mongoose.connection.readyState === 1;

const hideCredentials = (uri) => uri.replace(/\/\/[^@/]+@/, '//***@');
const isLocalUri = (uri) => /^mongodb:\/\/(localhost|127\.0\.0\.1)[:/]/.test(uri);

async function connectExternal(uri) {
  const options = { serverSelectionTimeoutMS: isLocalUri(uri) ? 2500 : 12000 };
  try {
    await mongoose.connect(uri, options);
  } catch (err) {
    // No Windows, o Node às vezes usa um DNS local (127.0.0.1) que recusa as consultas SRV
    // do mongodb+srv:// (Atlas). Nesse caso, tenta de novo com DNS públicos.
    if (!/querySrv|queryTxt/.test(err.message)) throw err;
    dns.setServers(['1.1.1.1', '8.8.8.8']);
    await mongoose.connect(uri, options);
  }
}

async function startEmbeddedMongo() {
  const { MongoMemoryServer } = await import('mongodb-memory-server-core');
  fs.mkdirSync(config.embeddedDbPath, { recursive: true });

  // Ao reiniciar rápido, o mongod anterior pode ainda segurar a pasta de dados por alguns segundos.
  for (let attempt = 1; ; attempt++) {
    try {
      return await MongoMemoryServer.create({
        instance: { dbPath: config.embeddedDbPath, storageEngine: 'wiredTiger', dbName: DB_NAME },
      });
    } catch (err) {
      if (attempt >= 5) throw err;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

// Idempotente: chamadas repetidas (ex.: cada requisição na Vercel) reaproveitam a mesma conexão.
let connecting = null;
export function connectDatabase() {
  if (isDbReady()) return Promise.resolve();
  connecting ??= doConnect().finally(() => {
    if (!isDbReady()) connecting = null;
  });
  return connecting;
}

async function doConnect() {
  try {
    await connectExternal(config.mongoUri);
    status = { state: 'conectado', mode: isLocalUri(config.mongoUri) ? 'local' : 'remoto' };
    console.log(`[db] MongoDB conectado em ${hideCredentials(config.mongoUri)}`);
    return;
  } catch (err) {
    console.log(`[db] Não foi possível conectar em ${hideCredentials(config.mongoUri)}: ${hideCredentials(err.message)}`);
  }

  if (!config.embeddedMongo) {
    status = { state: 'offline', mode: null };
    console.warn('[db] MongoDB embutido desativado. O site funciona, mas sem salvar resultados.');
    return;
  }

  try {
    console.log('[db] Iniciando MongoDB embutido (no primeiro start ele baixa o MongoDB, pode levar alguns minutos)...');
    memoryServer = await startEmbeddedMongo();
    await mongoose.connect(memoryServer.getUri(DB_NAME), { serverSelectionTimeoutMS: 10000 });
    status = { state: 'conectado', mode: 'embutido' };
    console.log(`[db] MongoDB embutido conectado. Dados em ${config.embeddedDbPath}`);
  } catch (err) {
    status = { state: 'offline', mode: null };
    console.error('[db] Não foi possível iniciar o MongoDB embutido:', err.message);
    console.warn('[db] O site funciona, mas sem salvar resultados nem links de compartilhamento.');
  }
}

export async function closeDatabase() {
  await mongoose.disconnect().catch(() => {});
  if (memoryServer) await memoryServer.stop({ doCleanup: false }).catch(() => {});
}
