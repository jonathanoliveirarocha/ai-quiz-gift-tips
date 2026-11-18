import { C, FONT_DISPLAY } from "../theme";
import { Hi } from "./Text";

/**
 * Caixinha do logo (mesmo SVG do favicon do site), com a tampa separada
 * para poder abrir. `lidLift` é em pixels da tela; o giro é em torno de (4, 30).
 */
export const GiftBox: React.FC<{
  size: number;
  id: string;
  lidLift?: number;
  lidRotate?: number;
  style?: React.CSSProperties;
}> = ({ size, id, lidLift = 0, lidRotate = 0, style }) => {
  const lift = (lidLift * 64) / size;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ overflow: "visible", ...style }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.coral} />
          <stop offset=".5" stopColor={C.pink} />
          <stop offset="1" stopColor={C.violet} />
        </linearGradient>
      </defs>
      <rect x="8" y="26" width="48" height="32" rx="6" fill={`url(#${id})`} />
      <rect x="28" y="30" width="8" height="28" fill="#fff" opacity=".9" />
      <g transform={`translate(0 ${-lift}) rotate(${lidRotate} 4 30)`}>
        <rect x="4" y="18" width="56" height="12" rx="5" fill={`url(#${id})`} />
        <rect x="28" y="18" width="8" height="12" fill="#fff" opacity=".9" />
        <path
          d="M32 18c-4-10-16-12-16-4 0 5 9 5 16 4zm0 0c4-10 16-12 16-4 0 5-9 5-16 4z"
          fill="none"
          stroke={C.gold}
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

/** "Mimo Certo" com "Certo" em itálico e degradê, como no topo do site. */
export const Wordmark: React.FC<{ size: number; g?: number; shineAt?: number; weight?: number }> = ({
  size,
  g = 0,
  shineAt,
  weight = 600,
}) => (
  <span
    style={{
      fontFamily: FONT_DISPLAY,
      fontWeight: weight,
      fontSize: size,
      color: C.text,
      letterSpacing: "-0.02em",
      lineHeight: 1,
      whiteSpace: "nowrap",
    }}
  >
    Mimo{" "}
    <Hi g={g} shineAt={shineAt} glow={false}>
      Certo
    </Hi>
  </span>
);
