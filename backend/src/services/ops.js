// Operação automática: uso diário de IA (teto de custo) e alertas para o dono do site.
import { config } from '../config.js';
import { isDbReady } from '../db.js';
import { Usage } from '../models.js';
import { hit } from './security.js';

// Dia no fuso de Brasília, para o teto diário virar à meia-noite daqui.
export const today = () => new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString().slice(0, 10);

const memoryUsage = new Map();

/** Soma contadores do dia (aiCalls, aiFailures, fallbacks, quizzes) e devolve o documento do dia. */
export async function addUsage(fields) {
  const id = today();
  if (!isDbReady()) {
    const day = memoryUsage.get(id) ?? { aiCalls: 0, aiFailures: 0, fallbacks: 0, quizzes: 0 };
    for (const [k, v] of Object.entries(fields)) day[k] = (day[k] ?? 0) + v;
    memoryUsage.clear();
    memoryUsage.set(id, day);
    return day;
  }
  try {
    return await Usage.findOneAndUpdate(
      { _id: id },
      { $inc: fields, $setOnInsert: { day: new Date(`${id}T12:00:00Z`) } },
      { upsert: true, returnDocument: 'after', lean: true },
    );
  } catch {
    return null;
  }
}

export async function usageToday() {
  const id = today();
  if (!isDbReady()) return memoryUsage.get(id) ?? { aiCalls: 0, aiFailures: 0, fallbacks: 0, quizzes: 0 };
  return (await Usage.findById(id).lean().catch(() => null)) ?? { aiCalls: 0, aiFailures: 0, fallbacks: 0, quizzes: 0 };
}

/**
 * Reserva uma chamada de IA dentro do teto diário. Devolve false se o teto já foi atingido
 * (nesse caso as sugestões vêm do acervo próprio, sem custo).
 */
export async function reserveAiCall() {
  if (!config.maxAiCallsPerDay) return true;
  const day = await addUsage({ aiCalls: 1 });
  if (!day) return true;
  if (day.aiCalls === config.maxAiCallsPerDay + 1) {
    alert('teto-ia', `Teto diário de ${config.maxAiCallsPerDay} chamadas de IA atingido. Até a meia-noite, as sugestões vêm do acervo próprio.`);
  }
  return day.aiCalls <= config.maxAiCallsPerDay;
}

/** Registra uma falha da IA e avisa se houver muitas seguidas (5 em 10 minutos). */
export async function recordAiFailure(reason) {
  await addUsage({ aiFailures: 1 });
  const recent = await hit('falhas-ia', 10 * 60 * 1000);
  if (recent === 5) alert('falhas-ia', `5 falhas da IA nos últimos 10 minutos (última: ${reason}). As sugestões estão vindo do modelo reserva ou do acervo.`);
}

const TELEGRAM = /api\.telegram\.org/;

/**
 * Envia um alerta para ALERT_WEBHOOK_URL (Discord, Slack ou Telegram), no máximo uma vez a cada 30 minutos por tipo.
 * Sem webhook, o alerta fica só no log.
 */
export async function alert(kind, message) {
  console.warn(`[alerta:${kind}] ${message}`);
  if (!config.alertWebhookUrl) return;
  try {
    const count = await hit(`alerta:${kind}`, 30 * 60 * 1000);
    if (count > 1) return;
    const text = `🎁 Presente Certo: ${message}`;
    if (TELEGRAM.test(config.alertWebhookUrl)) {
      const url = new URL(config.alertWebhookUrl);
      url.searchParams.set('text', text);
      await fetch(url, { signal: AbortSignal.timeout(5000) });
    } else {
      await fetch(config.alertWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Discord lê "content"; Slack e a maioria dos webhooks leem "text".
        body: JSON.stringify({ content: text, text }),
        signal: AbortSignal.timeout(5000),
      });
    }
  } catch (err) {
    console.error('[alerta] falha ao enviar webhook:', err.message);
  }
}
