import { Easing, interpolate, spring } from "remotion";

export const FPS = 30;
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);
export const EASE_IN_OUT = Easing.inOut(Easing.cubic);
export const EASE_MOVE = Easing.bezier(0.45, 0, 0.2, 1);

type SpringCfg = { damping?: number; stiffness?: number; mass?: number };

/** Spring que começa no frame `start` (antes dele vale 0). */
export const sp = (g: number, start: number, config: SpringCfg = {}) =>
  g < start ? 0 : spring({ frame: g - start, fps: FPS, config: { damping: 14, stiffness: 160, ...config } });

/** 0 → 1 entre dois frames, com easing. */
export const prog = (g: number, a: number, b: number, easing = EASE_OUT) =>
  interpolate(g, [a, b], [0, 1], { ...clamp, easing });

/** Pulso 1 → v → 1 centrado no frame `at`. */
export const pulse = (g: number, at: number, v: number, before = 3, after = 5) =>
  interpolate(g, [at - before, at, at + after], [1, v, 1], clamp);

/**
 * Presets do roteiro.
 * ENTRA: spring (damping 14, stiffness 160), sobe 48px, opacidade em 6 frames e blur de 8px a 0.
 * SAI: em 8 frames sobe 36px e some.
 */
export const enterExit = (g: number, inAt: number, outAt?: number): React.CSSProperties => {
  const p = sp(g, inAt);
  let ty = 48 * (1 - p);
  let opacity = interpolate(g, [inAt, inAt + 6], [0, 1], clamp);
  const blur = Math.max(0, 8 * (1 - Math.min(p, 1)));
  if (outAt !== undefined) {
    const e = prog(g, outAt, outAt + 8, EASE_IN);
    ty -= 36 * e;
    opacity *= 1 - e;
  }
  return { opacity, translate: `0px ${ty}px`, filter: blur > 0.1 ? `blur(${blur}px)` : undefined };
};

/** Troca de tela dentro do celular: entra da direita e sai para a esquerda em 8 frames. */
export const slide = (g: number, enterAt?: number, exitAt?: number): React.CSSProperties => {
  const i = enterAt === undefined ? 1 : prog(g, enterAt, enterAt + 8);
  const o = exitAt === undefined ? 0 : prog(g, exitAt, exitAt + 8, EASE_IN);
  return { opacity: i * (1 - o), translate: `${60 * (1 - i) - 60 * o}px 0px` };
};
