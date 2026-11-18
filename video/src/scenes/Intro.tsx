import { interpolate, useCurrentFrame } from "remotion";
import { C, FONT_DISPLAY } from "../theme";
import { clamp, EASE_IN, enterExit, prog, sp } from "../anim";
import { GiftBox, Wordmark } from "../components/Logo";
import { Hand, Hi, Line, TextBlock, TITLE } from "../components/Text";
import { Star4 } from "../components/Icons";

const BURSTS: [number, number][] = [
  [0, 14],
  [20, 34],
  [40, 50],
];

/**
 * Caixinha das cenas 1 e 2 (frames 0 a 131): treme, abre a tampa, solta brilhos
 * e depois fecha, encolhe e vira o logo com "Mimo Certo" ao lado.
 */
export const HeroBox: React.FC = () => {
  const g = useCurrentFrame();

  // Tremida em rajadas, com pulinho no começo de cada uma.
  let rotate = 0;
  let hop = 0;
  for (const [a, b] of BURSTS) {
    if (g >= a && g <= b) {
      const env = interpolate(g, [a, a + 2, b - 3, b], [0.7, 1, 1, 0], clamp);
      rotate = 7 * Math.sin(g * 1.1) * env;
      hop = -10 * Math.sin(Math.PI * Math.min(1, (g - a) / 8));
    }
  }

  // Tampa salta no frame 52 e fecha a partir do 64, junto com a ida para o logo.
  const pop = sp(g, 52, { damping: 10, stiffness: 170 });
  const toLogo = sp(g, 64, { damping: 15, stiffness: 120 });
  const lid = pop * (1 - Math.min(1, toLogo));
  const size = 380 + (150 - 380) * toLogo;
  const cx = 510 + (236 - 510) * toLogo;
  const cy = 1060 + (1010 - 1060) * toLogo;

  // Saída do logo (124 a 131).
  const out = prog(g, 124, 131, EASE_IN);
  const word = prog(g, 80, 94);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transformOrigin: "510px 1010px",
        translate: `0px ${-40 * out}px`,
        scale: 1 - 0.4 * out,
        opacity: 1 - out,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: cx - size / 2,
          top: cy - size / 2 + hop,
          width: size,
          height: size,
          rotate: `${rotate}deg`,
          filter: `drop-shadow(0 0 ${60 * (1 - toLogo) + 20}px rgba(255,79,179,.5))`,
        }}
      >
        <GiftBox size={size} id="hero-box" lidLift={90 * lid * (size / 380)} lidRotate={-20 * lid} />
      </div>

      {/* Brilhos dourados quando a tampa salta (52 a 66) */}
      {g >= 52 && g <= 66
        ? Array.from({ length: 8 }, (_, i) => {
            const t = prog(g, 52, 66);
            const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
            const d = 240 * t;
            return (
              <Star4
                key={i}
                size={48}
                color={C.gold}
                style={{
                  position: "absolute",
                  left: 510 + Math.cos(a) * d - 24,
                  top: 894 + Math.sin(a) * d * 0.8 - 24,
                  opacity: interpolate(g, [52, 54, 60, 66], [0, 1, 1, 0], clamp),
                  rotate: `${i * 20 + t * 90}deg`,
                  scale: 0.6 + 0.6 * t,
                }}
              />
            );
          })
        : null}

      {/* "Mimo Certo" ao lado da caixinha */}
      <div
        style={{
          position: "absolute",
          left: 339,
          top: 1010,
          translate: `${40 * (1 - word)}px -50%`,
          opacity: word,
        }}
      >
        <Wordmark size={96} g={g} shineAt={96} />
      </div>
    </div>
  );
};

/** Cena 1: gancho (frames 0 a 59). */
export const Scene1: React.FC = () => {
  const g = useCurrentFrame();
  const settle = interpolate(sp(g, 0, { damping: 14, stiffness: 160 }), [0, 1], [1.06, 1]);
  const exit = enterExit(g, -100, 50); // já visível no frame 0, sai no 50
  const qOut = prog(g, 50, 56, EASE_IN);
  return (
    <>
      <div style={{ ...exit, position: "absolute", inset: 0 }}>
        <TextBlock top={300}>
          <div style={{ ...TITLE, fontSize: 128, scale: settle, whiteSpace: "normal" }}>
            Não sabe
            <br />o que dar
            <br />
            de <Hi g={g}>presente?</Hi>
          </div>
        </TextBlock>
      </div>
      {[
        { color: C.gold, x: 290, y: 900, r: -14, at: 3, ph: 0 },
        { color: C.mint, x: 750, y: 880, r: 12, at: 8, ph: 1.3 },
        { color: C.pink, x: 720, y: 1250, r: 10, at: 13, ph: 2.6 },
      ].map((q) => {
        const s = sp(g, q.at, { damping: 9, stiffness: 200 });
        return (
          <div
            key={q.color}
            style={{
              position: "absolute",
              left: q.x,
              top: q.y,
              translate: `-50% calc(-50% + ${Math.sin(g * 0.18 + q.ph) * 8}px)`,
              rotate: `${q.r}deg`,
              scale: s * (1 - qOut),
              fontFamily: FONT_DISPLAY,
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 160,
              lineHeight: 1,
              color: q.color,
              textShadow: `0 0 40px ${q.color}88`,
            }}
          >
            ?
          </div>
        );
      })}
    </>
  );
};

/** Cena 2: virada (frames 60 a 131). */
export const Scene2: React.FC = () => {
  const g = useCurrentFrame() + 60;
  return (
    <TextBlock top={280}>
      <div style={{ opacity: 1 - prog(g, 124, 132, EASE_IN), translate: `0px ${-36 * prog(g, 124, 132, EASE_IN)}px` }}>
        <Hand g={g} from={60} to={70} size={130}>
          Relaxa.
        </Hand>
      </div>
      <Line g={g} inAt={66} outAt={126} style={{ fontSize: 100, marginTop: 14 }}>
        A IA indica
      </Line>
      <Line g={g} inAt={71} outAt={128} style={{ fontSize: 100 }}>
        o presente
      </Line>
      <Line g={g} inAt={76} outAt={130} style={{ fontSize: 150 }}>
        <Hi g={g} shineAt={96}>
          certo
        </Hi>
        .
      </Line>
    </TextBlock>
  );
};
