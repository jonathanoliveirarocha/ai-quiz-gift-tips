import { interpolate, useCurrentFrame } from "remotion";
import { clamp, EASE_MOVE } from "../anim";
import { chipCenter, optionCenter, otherButtonCenter, skipCenter } from "./Screens";

type Key = { f: number; x: number; y: number };
type Path = { show: [number, number]; keys: Key[]; taps: number[] };

const at = (f: number, p: { x: number; y: number }): Key => ({ f, ...p });

const AMIGO = optionCenter(3);
const BUDGET = optionCenter(2);
const CAFE = chipCenter(0, 1);
const LEITURA = chipCenter(0, 2);
const PLANTAS = chipCenter(2, 0);
const PILL = { x: 510, y: 912 };

// Frames globais, conforme o roteiro.
const PATHS: Path[] = [
  {
    show: [158, 304],
    keys: [
      { f: 158, x: 760, y: 1380 },
      at(170, AMIGO),
      at(192, AMIGO),
      at(204, BUDGET),
      at(224, BUDGET),
      at(234, CAFE),
      at(238, CAFE),
      at(242, LEITURA),
      at(246, LEITURA),
      at(250, PLANTAS),
      at(278, PLANTAS),
      at(290, skipCenter),
    ],
    taps: [172, 206, 236, 244, 252, 292],
  },
  { show: [484, 520], keys: [{ f: 484, x: 800, y: 1300 }, at(496, otherButtonCenter)], taps: [498] },
  { show: [686, 718], keys: [{ f: 686, x: 820, y: 1320 }, at(698, PILL)], taps: [700] },
];

const position = (g: number, keys: Key[]) => {
  if (g <= keys[0].f) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (g <= b.f) {
      const t = interpolate(g, [a.f, b.f], [0, 1], { ...clamp, easing: EASE_MOVE });
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
  }
  return keys[keys.length - 1];
};

/** Cursor de toque: círculo branco que viaja até o alvo, aperta e solta uma onda. */
export const Cursor: React.FC = () => {
  const g = useCurrentFrame();
  const path = PATHS.find((p) => g >= p.show[0] && g <= p.show[1]);
  if (!path) return null;
  const { x, y } = position(g, path.keys);
  const opacity = interpolate(g, [path.show[0], path.show[0] + 6, path.show[1] - 6, path.show[1]], [0, 1, 1, 0], clamp);
  const press = path.taps.reduce(
    (s, t) => s * interpolate(g, [t - 3, t, t + 3], [1, 0.82, 1], clamp),
    1,
  );
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity, zIndex: 50 }}>
      {path.taps
        .filter((t) => g >= t && g <= t + 14)
        .map((t) => {
          const p = (g - t) / 14;
          return (
            <div
              key={t}
              style={{
                position: "absolute",
                left: -36,
                top: -36,
                width: 72,
                height: 72,
                borderRadius: "50%",
                border: "4px solid #fff",
                scale: 0.6 + 1.3 * p,
                opacity: 0.7 * (1 - p),
              }}
            />
          );
        })}
      <div
        style={{
          position: "absolute",
          left: -36,
          top: -36,
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "rgba(255,255,255,.42)",
          border: "4px solid rgba(255,255,255,.95)",
          boxShadow: "0 10px 30px rgba(0,0,0,.35), inset 0 0 18px rgba(255,255,255,.4)",
          scale: press,
        }}
      />
    </div>
  );
};
