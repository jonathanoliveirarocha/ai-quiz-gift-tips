import crypto from 'node:crypto';
import { config } from '../config.js';
import { isDbReady } from '../db.js';
import { Counter } from '../models.js';

export const randomId = (bytes = 16) => crypto.randomBytes(bytes).toString('base64url');
export const sha256 = (value) => crypto.createHash('sha256').update(String(value)).digest('hex');

/** Compara segredos em tempo constante (evita descobrir o token pelo tempo de resposta). */
export function safeEqual(a, b) {
  const left = Buffer.from(sha256(a ?? ''));
  const right = Buffer.from(sha256(b ?? ''));
  return crypto.timingSafeEqual(left, right);
}

/** O IP vira um código com sal: os contadores de limite nunca guardam o IP em si. */
export const ipKey = (req) => sha256(`${config.ipSalt}:${req.ip ?? 'sem-ip'}`).slice(0, 24);

// Reserva em memória para quando o banco estiver fora (vale só para a instância atual).
const memory = new Map();
function memoryHit(key, windowMs) {
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || entry.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + windowMs });
    if (memory.size > 5000) for (const [k, v] of memory) if (v.resetAt <= now) memory.delete(k);
    return 1;
  }
  entry.count += 1;
  return entry.count;
}

/**
 * Soma 1 no contador `key` dentro de uma janela fixa e devolve o total.
 * Usa o MongoDB (compartilhado entre instâncias serverless); sem banco, cai para a memória.
 */
export async function hit(key, windowMs) {
  const windowStart = Math.floor(Date.now() / windowMs) * windowMs;
  const id = `${key}:${windowStart}`;
  if (!isDbReady()) return memoryHit(id, windowMs);
  try {
    const doc = await Counter.findOneAndUpdate(
      { _id: id },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(windowStart + windowMs) } },
      { upsert: true, returnDocument: 'after', lean: true },
    );
    return doc.count;
  } catch {
    return memoryHit(id, windowMs);
  }
}

/** Middleware de limite por IP: `limit` requisições a cada `windowMs`. */
export function rateLimit(name, limit, windowMs, message = 'Muitas tentativas seguidas. Espere alguns minutos e tente de novo.') {
  return async (req, res, next) => {
    try {
      const count = await hit(`rl:${name}:${ipKey(req)}`, windowMs);
      if (count > limit) {
        res.set('Retry-After', String(Math.ceil(windowMs / 1000)));
        return res.status(429).json({ error: message });
      }
    } catch {
      // Se o contador falhar, não bloqueia o visitante.
    }
    next();
  };
}

/** Confere o token do Cloudflare Turnstile quando TURNSTILE_SECRET_KEY está definida. */
export async function verifyTurnstile(token, ip) {
  if (!config.turnstileSecret) return true;
  if (typeof token !== 'string' || !token) return false;
  try {
    const body = new URLSearchParams({ secret: config.turnstileSecret, response: token });
    if (ip) body.set('remoteip', ip);
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    return data.success === true;
  } catch (err) {
    // Se a Cloudflare estiver fora, não derruba o quiz (o limite por IP continua valendo).
    console.error('[turnstile]', err.message);
    return true;
  }
}

/** Origem da visita (utm_source etc.), limpa: letras minúsculas, números e hífen. */
export function cleanChannel(value) {
  const channel = String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 24);
  return channel || 'direto';
}
