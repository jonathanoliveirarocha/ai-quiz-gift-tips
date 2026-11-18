import { interpolate } from "remotion";
import { C, FONT_BODY, FONT_DISPLAY, FONT_HAND, GRAD } from "../theme";
import { clamp, enterExit, prog } from "../anim";

export const TITLE: React.CSSProperties = {
  fontFamily: FONT_DISPLAY,
  fontWeight: 700,
  letterSpacing: "-0.03em",
  lineHeight: 1.02,
  color: C.text,
  textShadow: "0 6px 30px rgba(0,0,0,.45)",
  whiteSpace: "nowrap",
};

export const SUPPORT: React.CSSProperties = {
  fontFamily: FONT_BODY,
  fontWeight: 700,
  fontSize: 50,
  lineHeight: 1.2,
  color: C.muted,
  letterSpacing: "-0.01em",
  textShadow: "0 4px 20px rgba(0,0,0,.45)",
  whiteSpace: "nowrap",
};

/** Bloco de texto centralizado na área segura (x de 80 a 940, centro em 510). */
export const TextBlock: React.FC<{ top: number; children: React.ReactNode; left?: number; width?: number }> = ({
  top,
  children,
  left = 80,
  width = 860,
}) => (
  <div
    style={{
      position: "absolute",
      left,
      width,
      top,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    }}
  >
    {children}
  </div>
);

/** Uma linha de texto com os presets ENTRA e SAI. */
export const Line: React.FC<{
  g: number;
  inAt: number;
  outAt?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ g, inAt, outAt, style, children }) => (
  <div style={{ ...TITLE, ...style, ...enterExit(g, inAt, outAt) }}>{children}</div>
);

/** Palavra em destaque: Fraunces itálico com o degradê da marca e um brilho que atravessa. */
export const Hi: React.FC<{
  g: number;
  shineAt?: number;
  glow?: boolean;
  children: React.ReactNode;
}> = ({ g, shineAt, glow = true, children }) => {
  const pos = shineAt === undefined ? 100 : interpolate(g, [shineAt, shineAt + 24], [100, 0], clamp);
  return (
    <span
      style={{
        display: "inline-block",
        fontStyle: "italic",
        backgroundImage: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.95) 50%, transparent 60%), ${GRAD}`,
        backgroundSize: "250% 100%, 100% 100%",
        backgroundPosition: `${pos}% 0%, 0% 0%`,
        backgroundRepeat: "no-repeat",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        textShadow: "none",
        padding: "0 0.12em 0.08em 0.04em",
        margin: "0 -0.08em -0.08em -0.02em",
        filter: glow ? "drop-shadow(0 6px 26px rgba(255,79,179,0.35))" : undefined,
      }}
    >
      {children}
    </span>
  );
};

/** Texto manuscrito (Caveat dourado) que aparece da esquerda para a direita. */
export const Hand: React.FC<{
  g: number;
  from: number;
  to: number;
  size: number;
  rotate?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ g, from, to, size, rotate = -4, style, children }) => {
  const p = prog(g, from, to, (t) => t);
  return (
    <div
      style={{
        fontFamily: FONT_HAND,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1,
        color: C.gold,
        rotate: `${rotate}deg`,
        clipPath: `inset(-40% ${100 - p * 115}% -40% -10%)`,
        textShadow: "0 6px 26px rgba(0,0,0,.4)",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Sublinhado dourado desenhado à mão (p de 0 a 1). */
export const HandUnderline: React.FC<{ p: number }> = ({ p }) => (
  <svg
    viewBox="0 0 300 30"
    preserveAspectRatio="none"
    style={{ position: "absolute", left: "2%", bottom: -18, width: "96%", height: 30, overflow: "visible" }}
  >
    <path
      d="M6 20 C 70 8, 150 6, 294 14"
      fill="none"
      stroke={C.gold}
      strokeWidth={8}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - p}
    />
  </svg>
);
