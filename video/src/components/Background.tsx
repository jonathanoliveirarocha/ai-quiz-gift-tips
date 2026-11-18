import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { FPS } from "../anim";

// Fundo do site: manchas desfocadas derivando devagar, brilhos piscando e vinheta.
const BLOBS = [
  { color: C.coral, cx: 180, cy: 320, r: 520, opacity: 0.28, phase: 0 },
  { color: C.pink, cx: 900, cy: 950, r: 460, opacity: 0.2, phase: 2.1 },
  { color: C.violet, cx: 300, cy: 1620, r: 600, opacity: 0.3, phase: 4.2 },
];

const SPARKLES = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: (i * 53 + 7) % 100,
  size: 3 + (i % 3),
  phase: (i * 0.77) % (Math.PI * 2),
  speed: 0.06 + (i % 5) * 0.01,
}));

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const w = (frame / FPS) * ((Math.PI * 2) / 8); // período de 8 s
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      {BLOBS.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: b.cx - b.r,
            top: b.cy - b.r,
            width: b.r * 2,
            height: b.r * 2,
            borderRadius: "50%",
            background: b.color,
            opacity: b.opacity,
            filter: "blur(140px)",
            translate: `${Math.sin(w + b.phase) * 40}px ${Math.cos(w + b.phase) * 40}px`,
          }}
        />
      ))}
      {SPARKLES.map((s, i) => (
        <div
          key={`s${i}`}
          style={{
            position: "absolute",
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 0 10px rgba(255,255,255,0.9)",
            opacity: 0.2 + Math.max(0, Math.sin(frame * s.speed + s.phase)) * 0.6,
          }}
        />
      ))}
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(8, 5, 18, 0.7))" }}
      />
    </AbsoluteFill>
  );
};
