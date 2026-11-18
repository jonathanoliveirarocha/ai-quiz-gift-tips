import { interpolate, useCurrentFrame } from "remotion";
import { C, FONT_BODY } from "../theme";
import { clamp, EASE_IN, prog, sp } from "../anim";
import { GiftBox, Wordmark } from "../components/Logo";
import { Hand, Hi, Line, TextBlock, TITLE } from "../components/Text";
import { Check, ShieldCheck } from "../components/Icons";

const BENEFITS = [
  { text: "Grátis", at: 554, top: 400, size: 150, circle: 110, hi: true },
  { text: "Sem cadastro", at: 562, top: 640, size: 84, circle: 96, hi: false },
  { text: "Sem e-mail", at: 569, top: 790, size: 84, circle: 96, hi: false },
  { text: "Sem cartão", at: 576, top: 940, size: 84, circle: 96, hi: false },
  { text: "Em 2 minutos", at: 583, top: 1090, size: 84, circle: 96, hi: false },
];

/** Cena 7: benefícios, uma lista que se marca sozinha (frames 552 a 632). */
export const Scene7: React.FC = () => {
  const g = useCurrentFrame() + 552;
  return (
    <>
      {BENEFITS.map((b, i) => {
        const pop = sp(g, b.at, { damping: 10, stiffness: 220 });
        const draw = prog(g, b.at + 2, b.at + 8, (t) => t);
        const txt = prog(g, b.at + 1, b.at + 9);
        const out = prog(g, 624 + i, 632 + i, EASE_IN);
        const h = b.size * 1.02;
        return (
          <div
            key={b.text}
            style={{
              position: "absolute",
              left: 175,
              top: b.top,
              height: h,
              display: "flex",
              alignItems: "center",
              gap: 34,
              opacity: 1 - out,
              translate: `${-60 * out}px 0px`,
            }}
          >
            <div
              style={{
                display: "grid",
                placeItems: "center",
                width: b.circle,
                height: b.circle,
                flexShrink: 0,
                borderRadius: "50%",
                background: C.mint,
                boxShadow: "0 0 40px rgba(95,242,195,.45)",
                scale: pop,
              }}
            >
              <Check size={b.circle * 0.62} color={C.bg} stroke={3.2} p={draw} />
            </div>
            <div
              style={{
                ...TITLE,
                fontSize: b.size,
                opacity: txt,
                translate: `${-40 * (1 - txt)}px 0px`,
              }}
            >
              {b.hi ? (
                <Hi g={g} shineAt={596}>
                  {b.text}
                </Hi>
              ) : (
                b.text
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

/** Cena 8: chamada final (frames 633 a 734). */
export const Scene8: React.FC = () => {
  const g = useCurrentFrame() + 633;
  const drop = sp(g, 633, { damping: 9, stiffness: 150 });
  const pill = sp(g, 654, { damping: 12, stiffness: 180 });
  const pillTap = interpolate(g, [697, 700, 706], [1, 0.97, 1], clamp);
  const angle = ((g - 654) / 90) * 360;
  const wobble = g >= 712 && g <= 724 ? 8 * Math.sin(((g - 712) / 6) * Math.PI * 2) : 0;
  const arrow = prog(g, 670, 682, (t) => t);
  const head = prog(g, 680, 686, (t) => t);
  return (
    <>
      {/* Logo caindo com quique */}
      <div
        style={{
          position: "absolute",
          left: 80,
          width: 860,
          top: 420,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 34,
          translate: `0px calc(-50% + ${-540 * (1 - drop)}px)`,
          opacity: prog(g, 633, 638),
        }}
      >
        <GiftBox
          size={170}
          id="cta-box"
          lidRotate={wobble}
          lidLift={Math.abs(wobble) * 1.2}
          style={{ filter: "drop-shadow(0 0 30px rgba(255,79,179,.5))" }}
        />
        <Wordmark size={100} g={g} shineAt={690} />
      </div>

      <TextBlock top={560}>
        <Line g={g} inAt={642} style={{ fontSize: 104 }}>
          Descubra o
        </Line>
        <Line g={g} inAt={647} style={{ fontSize: 104 }}>
          presente{" "}
          <Hi g={g} shineAt={660}>
            ideal
          </Hi>
        </Line>
      </TextBlock>

      {/* Pílula com o endereço e borda em degradê girando */}
      <div
        style={{
          position: "absolute",
          left: 510 - 380,
          top: 850,
          width: 760,
          height: 124,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 999,
          border: "3px solid transparent",
          background: `linear-gradient(rgba(24,15,46,.92), rgba(24,15,46,.92)) padding-box, conic-gradient(from ${angle}deg, ${C.coral}, ${C.pink}, ${C.violet}, ${C.gold}, ${C.coral}) border-box`,
          boxShadow: "0 20px 60px -20px rgba(255,79,179,.7)",
          fontFamily: FONT_BODY,
          fontWeight: 800,
          fontSize: 54,
          letterSpacing: "-0.01em",
          color: "#fff",
          scale: (0.8 + 0.2 * pill) * pillTap,
          opacity: prog(g, 654, 660),
        }}
      >
        mimocerto.vercel.app
      </div>

      {/* "link na bio" manuscrito, com seta desenhada até a pílula */}
      <div style={{ position: "absolute", left: 360, top: 1010 }}>
        <Hand g={g} from={664} to={680} size={96} rotate={-3}>
          link na bio
        </Hand>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <path
          d="M 350 1068 C 280 1076, 236 1046, 240 994"
          fill="none"
          stroke={C.gold}
          strokeWidth={6}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - arrow}
        />
        <path
          d="M 218 1014 L 240 990 L 262 1010"
          fill="none"
          stroke={C.gold}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - head}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: 80,
          width: 860,
          top: 1170,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 14,
          fontFamily: FONT_BODY,
          fontWeight: 600,
          fontSize: 40,
          color: C.muted,
          opacity: prog(g, 676, 684),
          translate: `0px ${20 * (1 - prog(g, 676, 686))}px`,
        }}
      >
        <ShieldCheck size={44} color={C.mint} stroke={2.4} />
        Grátis · 2 minutos · sem cadastro
      </div>
    </>
  );
};
