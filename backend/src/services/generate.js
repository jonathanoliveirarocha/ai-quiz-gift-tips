// Decide de onde vêm as sugestões, sem nunca deixar a visita terminar em erro:
// IA (modelo principal, depois o reserva) -> acervo próprio. O acervo também entra quando o teto
// diário de custo foi atingido ou quando "Quero outras ideias" passou do limite por resultado.
import { config } from '../config.js';
import { generateWithGemini, failureReason } from './gemini.js';
import { generateDemo } from './demo.js';
import { normalizeResult } from './result.js';
import { addUsage, recordAiFailure, reserveAiCall } from './ops.js';

function fromCollection(answers, exclude, channel) {
  return (
    normalizeResult(generateDemo(answers, exclude), answers, channel) ??
    // Se os filtros de "o que evitar" removerem tudo, ignora só o "evitar" (os filtros de idade continuam).
    normalizeResult(generateDemo(answers, exclude), { ...answers, avoid: '' }, channel)
  );
}

/**
 * @returns {Promise<{ result: object, mode: 'gemini' | 'acervo' | 'demo', model: string | null, reason?: string }>}
 */
export async function generateGifts(answers, exclude, { channel = 'direto', allowAi = true } = {}) {
  if (!config.geminiApiKey) return { result: fromCollection(answers, exclude, channel), mode: 'demo', model: null };

  let reason = 'limite de ideias novas para este resultado';
  if (allowAi) {
    reason = 'teto diário de IA';
    if (await reserveAiCall()) {
      let attempts = 0;
      try {
        const { data, model } = await generateWithGemini(answers, exclude, {
          // A primeira chamada já foi contada em reserveAiCall; as novas tentativas também custam.
          onAttempt: async () => {
            attempts += 1;
            if (attempts > 1) await addUsage({ aiCalls: 1 });
          },
          onFailure: (why) => recordAiFailure(why),
        });
        const result = normalizeResult(data, answers, channel);
        if (result) return { result, mode: 'gemini', model };
        reason = 'nenhuma sugestão passou nos filtros de segurança';
      } catch (err) {
        reason = failureReason(err);
      }
    }
  }

  await addUsage({ fallbacks: 1 });
  console.warn(`[ia] usando o acervo próprio (${reason})`);
  return { result: fromCollection(answers, exclude, channel), mode: 'acervo', model: null, reason };
}
