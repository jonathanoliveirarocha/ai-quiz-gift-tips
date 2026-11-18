import { interpolate } from "remotion";
import { C, FONT_BODY, FONT_DISPLAY, FONT_EMOJI, GRAD } from "../theme";
import { clamp, EASE_IN, EASE_IN_OUT, EASE_OUT, prog, pulse, slide, sp } from "../anim";
import { SCREEN } from "./Phone";
import { GiftBox } from "./Logo";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Star4 } from "./Icons";

// Todas as medidas abaixo são em coordenadas da tela do celular (668 px de largura).
const W = SCREEN.w;
const CARD = { left: 24, top: 212, w: 620, pad: 28 };
const BODY_TOP = 192; // início das opções, relativo ao topo do cartão
const OPT = { w: 274, h: 104, gap: 16 };
const CHIP = { h: 64, gap: 12 };
const ROW = { h: 64, gap: 12 }; // opções em lista (pergunta opcional)

// ---------------------------------------------------------------------------
// Alvos dos toques, em coordenadas do quadro (calculados com as mesmas medidas)
// ---------------------------------------------------------------------------
const bodyX = SCREEN.x + CARD.left + CARD.pad;
const bodyY = SCREEN.y + CARD.top + BODY_TOP;

/** Ponto de toque de uma opção: sobre o ícone, para o texto continuar legível. */
export const optionCenter = (i: number) => ({
  x: bodyX + (i % 2) * (OPT.w + OPT.gap) + 14 + 28 + 6,
  y: bodyY + Math.floor(i / 2) * (OPT.h + OPT.gap) + OPT.h / 2 + 8,
});

const CHIP_ROWS = [
  [
    { e: "🎵", l: "Música", w: 165 },
    { e: "☕", l: "Café", w: 136 },
    { e: "📚", l: "Leitura", w: 179 },
  ],
  [
    { e: "🎬", l: "Séries e filmes", w: 296 },
    { e: "🎮", l: "Games", w: 151 },
  ],
  [
    { e: "🪴", l: "Plantas", w: 179 },
    { e: "🐾", l: "Pets", w: 136 },
    { e: "📸", l: "Fotografia", w: 223 },
  ],
  [{ e: "✈️", l: "Viagens", w: 179 }],
];

export const chipCenter = (row: number, idx: number) => {
  const offset = CHIP_ROWS[row].slice(0, idx).reduce((s, c) => s + c.w + CHIP.gap, 0);
  return {
    x: bodyX + offset + CHIP_ROWS[row][idx].w / 2,
    y: bodyY + row * (CHIP.h + CHIP.gap) + CHIP.h / 2,
  };
};

const SKIP = { right: 644, top: 740, w: 210, h: 72 };
export const skipCenter = { x: SCREEN.x + SKIP.right - SKIP.w / 2, y: SCREEN.y + SKIP.top + SKIP.h / 2 };

// Resultado: rolagem e posição do botão do primeiro cartão de "Outras ideias".
const RESULT = { cardTop: 150, cardH: 572, othersTitle: 770, othersTop: 840, otherH: 246, otherGap: 16 };
const SCROLL = -(RESULT.othersTitle - 140);
const OTHER_BTN_Y = RESULT.othersTop + 24 + 118 + 16 + 32; // centro do botão do cartão 1
export const otherButtonCenter = { x: SCREEN.x + W / 2, y: SCREEN.y + OTHER_BTN_Y + SCROLL };

// ---------------------------------------------------------------------------
// Peças comuns
// ---------------------------------------------------------------------------
const Badge: React.FC<{ s: number }> = ({ s }) => (
  <span
    style={{
      position: "absolute",
      top: -13,
      right: -11,
      display: "grid",
      placeItems: "center",
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: GRAD,
      boxShadow: "0 6px 16px rgba(255,79,179,.6)",
      scale: s,
    }}
  >
    <Check size={22} color="#fff" stroke={3.4} />
  </span>
);

const Emoji: React.FC<{ e: string; size: number; box: number; radius?: number; bg?: string }> = ({
  e,
  size,
  box,
  radius = 16,
  bg = "rgba(255,255,255,.08)",
}) => (
  <span
    style={{
      display: "grid",
      placeItems: "center",
      width: box,
      height: box,
      flexShrink: 0,
      borderRadius: radius,
      background: bg,
      fontFamily: FONT_EMOJI,
      fontSize: size,
      lineHeight: 1,
    }}
  >
    {e}
  </span>
);

/** Barra de topo do quiz (voltar, progresso e contador), fixa enquanto as perguntas trocam. */
export const QuizTopBar: React.FC<{ g: number }> = ({ g }) => {
  const fill = interpolate(
    g,
    [190, 205, 224, 238, 272, 280, 300, 318],
    [2 / 11, 5 / 11, 5 / 11, 7 / 11, 7 / 11, 8 / 11, 8 / 11, 1],
    { ...clamp, easing: EASE_IN_OUT },
  );
  const count = g < 190 ? 2 : g < 224 ? 5 : g < 272 ? 7 : g < 304 ? 8 : g < 308 ? 9 : g < 312 ? 10 : 11;
  const glow = interpolate(g, [300, 318], [16, 32], clamp);
  const opacity = 1 - prog(g, 316, 324, EASE_IN);
  return (
    <div
      style={{
        position: "absolute",
        left: 24,
        right: 24,
        top: 140,
        height: 52,
        display: "flex",
        alignItems: "center",
        gap: 18,
        opacity,
      }}
    >
      <span
        style={{
          display: "grid",
          placeItems: "center",
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: C.glass,
          border: `1px solid ${C.border}`,
          color: C.text,
        }}
      >
        <ArrowLeft size={26} />
      </span>
      <div style={{ flex: 1, height: 12, borderRadius: 999, background: "rgba(255,255,255,.1)", overflow: "hidden" }}>
        <div
          style={{
            width: `${fill * 100}%`,
            height: "100%",
            borderRadius: 999,
            background: GRAD,
            boxShadow: `0 0 ${glow}px rgba(255,79,179,.7)`,
          }}
        />
      </div>
      <span
        style={{
          minWidth: 64,
          textAlign: "right",
          fontFamily: FONT_BODY,
          fontWeight: 700,
          fontSize: 28,
          color: C.muted,
        }}
      >
        {count}/11
      </span>
    </div>
  );
};

const QuizCard: React.FC<{
  overline: string;
  question: string;
  height: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ overline, question, height, style, children }) => (
  <div
    style={{
      position: "absolute",
      left: CARD.left,
      top: CARD.top,
      width: CARD.w,
      height,
      borderRadius: 32,
      background: C.glass,
      border: `1px solid ${C.border}`,
      boxShadow: "0 24px 60px -24px rgba(0,0,0,.6)",
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: CARD.pad,
        top: 28,
        fontFamily: FONT_BODY,
        fontWeight: 800,
        fontSize: 22,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: C.gold,
      }}
    >
      {overline}
    </div>
    <div
      style={{
        position: "absolute",
        left: CARD.pad,
        top: 66,
        width: CARD.w - CARD.pad * 2,
        fontFamily: FONT_DISPLAY,
        fontWeight: 700,
        fontSize: 44,
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
        color: C.text,
      }}
    >
      {question}
    </div>
    <div style={{ position: "absolute", left: CARD.pad, top: BODY_TOP, width: CARD.w - CARD.pad * 2 }}>{children}</div>
  </div>
);

const OptionCard: React.FC<{ g: number; e: string; label: string; tapAt?: number }> = ({ g, e, label, tapAt }) => {
  const sel = tapAt !== undefined && g >= tapAt;
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 12,
        height: OPT.h,
        padding: "0 14px",
        borderRadius: 22,
        background: sel
          ? `linear-gradient(rgba(30,18,52,.92), rgba(30,18,52,.92)) padding-box, ${GRAD} border-box`
          : "rgba(255,255,255,0.05)",
        border: sel ? "3px solid transparent" : `2px solid ${C.border}`,
        boxShadow: sel ? "0 12px 32px -12px rgba(255,79,179,.85)" : "none",
        scale: tapAt !== undefined ? pulse(g, tapAt, 0.96) : 1,
      }}
    >
      <Emoji e={e} size={30} box={56} />
      <span style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 25, lineHeight: 1.2, color: C.text }}>
        {label}
      </span>
      {sel && tapAt !== undefined ? <Badge s={sp(g, tapAt, { damping: 10, stiffness: 220 })} /> : null}
    </div>
  );
};

const OptionGrid: React.FC<{ g: number; options: [string, string][]; tap: { index: number; at: number } }> = ({
  g,
  options,
  tap,
}) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(2, ${OPT.w}px)`, gap: OPT.gap }}>
    {options.map(([e, label], i) => (
      <OptionCard key={label} g={g} e={e} label={label} tapAt={i === tap.index ? tap.at : undefined} />
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// Telas do quiz
// ---------------------------------------------------------------------------
export const ScreenRelation: React.FC<{ g: number }> = ({ g }) => (
  <QuizCard overline="Pergunta 2 de 11" question="Qual é a sua relação com Ana?" height={564} style={slide(g, undefined, 182)}>
    <OptionGrid
      g={g}
      tap={{ index: 3, at: 172 }}
      options={[
        ["👩", "Mãe"],
        ["👨", "Pai"],
        ["💞", "Par romântico"],
        ["🤝", "Amigo ou amiga"],
        ["🧑‍🤝‍🧑", "Irmão ou irmã"],
        ["🧒", "Filho ou filha"],
      ]}
    />
  </QuizCard>
);

export const ScreenBudget: React.FC<{ g: number }> = ({ g }) => (
  <QuizCard overline="Pergunta 5 de 11" question="Quanto você quer investir?" height={564} style={slide(g, 190, 216)}>
    <OptionGrid
      g={g}
      tap={{ index: 2, at: 206 }}
      // espaço não separável entre "R$" e o valor, para a quebra cair depois do "a"
      options={[
        ["🪙", "Até R$ 50"],
        ["💵", "R$ 50 a R$ 100"],
        ["💳", "R$ 100 a R$ 200"],
        ["💎", "R$ 200 a R$ 500"],
        ["👑", "R$ 500 a R$ 1.000"],
        ["🚀", "Acima de R$ 1.000"],
      ]}
    />
  </QuizCard>
);

const CHIP_TAPS: Record<string, number> = { Café: 236, Leitura: 244, Plantas: 252 };

export const ScreenLikes: React.FC<{ g: number }> = ({ g }) => {
  const chosen = Object.values(CHIP_TAPS).filter((t) => g >= t).length;
  return (
    <QuizCard overline="Pergunta 7 de 11" question="Do que Ana gosta?" height={560} style={slide(g, 224, 264)}>
      <div style={{ display: "flex", flexDirection: "column", gap: CHIP.gap }}>
        {CHIP_ROWS.map((row, r) => (
          <div key={r} style={{ display: "flex", gap: CHIP.gap }}>
            {row.map((c) => {
              const t = CHIP_TAPS[c.l];
              const on = t !== undefined && g >= t;
              return (
                <div
                  key={c.l}
                  style={{
                    width: c.w,
                    height: CHIP.h,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    borderRadius: 999,
                    fontFamily: FONT_BODY,
                    fontWeight: 600,
                    fontSize: 24,
                    whiteSpace: "nowrap",
                    color: on ? "#fff" : C.text,
                    background: on ? GRAD : "rgba(255,255,255,0.06)",
                    border: on ? "2px solid transparent" : `2px solid ${C.border}`,
                    boxShadow: on ? "0 10px 26px -10px rgba(255,79,179,.85)" : "none",
                    scale: t !== undefined ? interpolate(g, [t - 3, t, t + 3, t + 9], [1, 0.94, 1.08, 1], clamp) : 1,
                  }}
                >
                  <span style={{ fontFamily: FONT_EMOJI, fontSize: 26 }}>{c.e}</span>
                  {c.l}
                </div>
              );
            })}
          </div>
        ))}
        <div style={{ marginTop: 6, fontFamily: FONT_BODY, fontWeight: 600, fontSize: 22, color: C.soft }}>
          <span style={{ color: chosen ? C.mint : C.soft, fontWeight: 800 }}>{chosen}/8</span> escolhidos
        </div>
      </div>
    </QuizCard>
  );
};

export const ScreenSaturday: React.FC<{ g: number }> = ({ g }) => {
  const st = slide(g, 272, 296);
  return (
    <>
      <QuizCard
        overline="Pergunta 8 de 11 · opcional"
        question="Como é o sábado perfeito de Ana?"
        height={BODY_TOP + 4 * ROW.h + 3 * ROW.gap + CARD.pad}
        style={st}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: ROW.gap }}>
          {[
            ["🛋️", "Maratonando séries no sofá"],
            ["🥾", "Numa trilha ou na natureza"],
            ["🎉", "Numa festa com amigos"],
            ["🍲", "Cozinhando um almoço caprichado"],
          ].map(([e, l]) => (
            <div
              key={l}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                height: ROW.h,
                padding: "0 12px",
                borderRadius: 18,
                background: "rgba(255,255,255,0.05)",
                border: `2px solid ${C.border}`,
              }}
            >
              <Emoji e={e} size={24} box={44} radius={12} />
              <span style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 24, color: C.text, whiteSpace: "nowrap" }}>
                {l}
              </span>
            </div>
          ))}
        </div>
      </QuizCard>
      <div
        style={{
          position: "absolute",
          left: SKIP.right - SKIP.w,
          top: SKIP.top,
          width: SKIP.w,
          height: SKIP.h,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          borderRadius: 999,
          background: "#fff",
          color: C.ink,
          fontFamily: FONT_BODY,
          fontWeight: 700,
          fontSize: 30,
          boxShadow: "0 12px 30px -14px rgba(255,255,255,.6)",
          ...st,
          scale: pulse(g, 292, 0.92),
        }}
      >
        Pular <ArrowRight size={28} stroke={2.8} />
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------
// Carregamento
// ---------------------------------------------------------------------------
export const LoadingScreen: React.FC<{ g: number }> = ({ g }) => {
  const appear = prog(g, 316, 324);
  const out = prog(g, 356, 364, EASE_IN);
  const bounce = Math.abs(Math.sin((Math.PI * (g - 316)) / 12)) * 28;
  const msg1 = g < 340;
  const swapOut = prog(g, 336, 340, EASE_IN);
  const swapIn = prog(g, 340, 346);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: appear }}>
      <div
        style={{
          position: "absolute",
          left: W / 2 - 100,
          top: 250,
          width: 200,
          height: 200,
          scale: 1 + 0.3 * out,
          opacity: 1 - out,
        }}
      >
        <GiftBox
          size={200}
          id="loading-box"
          lidLift={bounce * (1 - out) + 200 * out}
          lidRotate={25 * out}
          style={{ filter: "drop-shadow(0 0 40px rgba(255,79,179,.55))" }}
        />
        {[
          { x: -70, y: -10, s: 34, ph: 0 },
          { x: 230, y: 20, s: 26, ph: 1.4 },
          { x: 200, y: -70, s: 38, ph: 2.6 },
        ].map((st, i) => (
          <Star4
            key={i}
            size={st.s}
            color={C.gold}
            style={{
              position: "absolute",
              left: st.x,
              top: st.y,
              opacity: 0.25 + Math.max(0, Math.sin(g * 0.35 + st.ph)) * 0.75,
              scale: 0.7 + Math.max(0, Math.sin(g * 0.35 + st.ph)) * 0.4,
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          width: W,
          top: 520,
          textAlign: "center",
          fontFamily: FONT_BODY,
          fontWeight: 600,
          fontSize: 32,
          color: C.text,
          opacity: (msg1 ? 1 - swapOut : swapIn) * (1 - out),
          translate: msg1 ? `0px ${-10 * swapOut}px` : `0px ${10 * (1 - swapIn)}px`,
        }}
      >
        {msg1 ? "Lendo tudo sobre Ana..." : "Embrulhando a ideia perfeita..."}
      </div>
      <div
        style={{
          position: "absolute",
          left: W / 2 - 180,
          top: 586,
          width: 360,
          height: 10,
          borderRadius: 999,
          background: "rgba(255,255,255,.08)",
          overflow: "hidden",
          opacity: 1 - out,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: ((g * 9) % 480) - 120,
            width: 120,
            height: "100%",
            borderRadius: 999,
            background: GRAD,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          width: W,
          top: 624,
          textAlign: "center",
          fontFamily: FONT_BODY,
          fontWeight: 500,
          fontSize: 22,
          color: C.soft,
          opacity: 1 - out,
        }}
      >
        Costuma levar de 10 a 25 segundos.
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Resultado
// ---------------------------------------------------------------------------
const rise = (g: number, at: number, dist = 16): React.CSSProperties => {
  const p = prog(g, at, at + 8);
  return { opacity: p, translate: `0px ${dist * (1 - p)}px` };
};

const Tag: React.FC<{ hue: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ hue, children, style }) => (
  <span
    style={{
      display: "inline-flex",
      alignSelf: "flex-start",
      padding: "5px 14px",
      borderRadius: 999,
      fontFamily: FONT_BODY,
      fontSize: 19,
      fontWeight: 700,
      color: `hsl(${hue} 95% 82%)`,
      background: `hsl(${hue} 80% 60% / 0.16)`,
      border: `1px solid hsl(${hue} 80% 70% / 0.3)`,
      ...style,
    }}
  >
    {children}
  </span>
);

const OTHERS = [
  { e: "💡", tag: "Leitura", title: "Luminária de leitura recarregável", hue: 48, pulseAt: undefined as number | undefined },
  { e: "🫘", tag: "Gourmet", title: "Kit de cafés especiais brasileiros", hue: 24, pulseAt: 508 },
  { e: "🌿", tag: "Casa", title: "Kit de vasos autoirrigáveis", hue: 150, pulseAt: 516 },
];

const OtherButton: React.FC<{ g: number; tapAt?: number; pulseAt?: number }> = ({ g, tapAt, pulseAt }) => {
  const fillP = tapAt !== undefined ? prog(g, tapAt, tapAt + 6) : 0;
  const hop = tapAt !== undefined ? interpolate(g, [tapAt, tapAt + 4, tapAt + 9], [0, 1, 0], clamp) : 0;
  const pul = pulseAt !== undefined ? interpolate(g, [pulseAt, pulseAt + 5, pulseAt + 10], [0, 1, 0], clamp) : 0;
  return (
    <div
      style={{
        position: "relative",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        borderRadius: 999,
        border: "2px solid rgba(255,255,255,.85)",
        fontFamily: FONT_BODY,
        fontWeight: 700,
        fontSize: 28,
        color: "#fff",
        overflow: "hidden",
        scale: (tapAt !== undefined ? pulse(g, tapAt, 0.96) : 1) * (1 + 0.04 * pul),
        boxShadow: `0 0 ${24 * pul}px rgba(255,79,179,${0.9 * pul})`,
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: GRAD, opacity: fillP }} />
      <span style={{ position: "relative" }}>Ver na loja</span>
      <ArrowUpRight size={28} stroke={2.8} style={{ position: "relative", translate: `${6 * hop}px ${-6 * hop}px` }} />
    </div>
  );
};

export const ResultScreen: React.FC<{ g: number }> = ({ g }) => {
  const appear = prog(g, 356, 371);
  const scroll = interpolate(g, [450, 474], [0, SCROLL], { ...clamp, easing: EASE_IN_OUT });
  const emojiPop = sp(g, 360, { damping: 12, stiffness: 180 });
  const quoteBg = interpolate(g, [392, 404, 420], [0.08, 0.22, 0.12], clamp);
  const quoteScale = interpolate(g, [392, 404, 420], [1, 1.03, 1], { ...clamp, easing: EASE_OUT });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: appear, scale: 0.97 + 0.03 * appear }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, translate: `0px ${scroll}px` }}>
        {/* Cartão do presente ideal, com borda em degradê como o .ideal do site */}
        <div
          style={{
            position: "absolute",
            left: CARD.left,
            top: RESULT.cardTop,
            width: CARD.w,
            height: RESULT.cardH,
            padding: 28,
            borderRadius: 34,
            background: `linear-gradient(rgba(26,16,48,.94), rgba(26,16,48,.94)) padding-box, ${GRAD} border-box`,
            border: "3px solid transparent",
            boxShadow: "0 30px 70px -30px rgba(255,79,179,.75)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 22, height: 128 }}>
            <div style={{ scale: emojiPop, rotate: `${-20 * (1 - emojiPop)}deg` }}>
              <Emoji
                e="☕"
                size={72}
                box={128}
                radius={32}
                bg="radial-gradient(circle at 30% 30%, rgba(255,255,255,.22), hsl(30 80% 55% / .35) 60%, hsl(30 80% 40% / .15))"
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span
                style={{
                  ...rise(g, 366),
                  display: "inline-flex",
                  alignSelf: "flex-start",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 16px",
                  borderRadius: 999,
                  fontFamily: FONT_BODY,
                  fontWeight: 700,
                  fontSize: 22,
                  color: C.text,
                  background: "rgba(255,255,255,.08)",
                  border: `1px solid ${C.border}`,
                }}
              >
                <span style={{ fontFamily: FONT_EMOJI }}>✨</span> Escolha principal
              </span>
              <Tag hue={30} style={rise(g, 378)}>
                Casa
              </Tag>
            </div>
          </div>
          <div
            style={{
              ...rise(g, 368),
              marginTop: 20,
              fontFamily: FONT_BODY,
              fontWeight: 800,
              fontSize: 21,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: C.gold,
            }}
          >
            O presente ideal para Ana
          </div>
          <div
            style={{
              ...rise(g, 372),
              marginTop: 8,
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: 46,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: C.text,
            }}
          >
            Moedor de café manual
          </div>
          <div style={{ ...rise(g, 378), marginTop: 14 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "baseline",
                gap: 10,
                padding: "8px 18px",
                borderRadius: 999,
                background: "rgba(255,255,255,.07)",
                border: `1px solid ${C.border}`,
                fontFamily: FONT_BODY,
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.1em", color: C.muted }}>ESTIMATIVA</span>
              <span style={{ fontSize: 28, fontWeight: 700, color: C.text }}>R$ 100 a R$ 200</span>
            </span>
          </div>
          <div
            style={{
              ...rise(g, 384),
              marginTop: 16,
              display: "flex",
              gap: 12,
              padding: "14px 18px",
              borderRadius: 14,
              borderLeft: `4px solid ${C.gold}`,
              background: `rgba(255,211,110,${quoteBg})`,
              fontFamily: FONT_BODY,
              fontWeight: 500,
              fontSize: 25,
              lineHeight: 1.35,
              color: C.text,
              scale: quoteScale,
            }}
          >
            <span style={{ fontFamily: FONT_EMOJI, fontSize: 26 }}>💡</span>
            <span>Ana ama café: moer o grão na hora deixa o ritual ainda mais especial.</span>
          </div>
          <div
            style={{
              ...rise(g, 390),
              marginTop: 18,
              height: 76,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              borderRadius: 999,
              background: GRAD,
              boxShadow: "0 16px 36px -12px rgba(255,79,179,.85)",
              fontFamily: FONT_BODY,
              fontWeight: 700,
              fontSize: 30,
              color: "#fff",
            }}
          >
            Ver na loja <ArrowUpRight size={30} stroke={2.8} />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: CARD.left,
            top: RESULT.othersTitle,
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: 40,
            letterSpacing: "-0.02em",
            color: C.text,
          }}
        >
          Outras ideias que combinam
        </div>
        {OTHERS.map((o, i) => (
          <div
            key={o.title}
            style={{
              position: "absolute",
              left: CARD.left,
              top: RESULT.othersTop + i * (RESULT.otherH + RESULT.otherGap),
              width: CARD.w,
              height: RESULT.otherH,
              padding: 24,
              borderRadius: 28,
              background: "rgba(255,255,255,0.06)",
              border: `1px solid ${C.border}`,
              ...rise(g, 462 + i * 4, 24),
            }}
          >
            <div style={{ display: "flex", gap: 18, minHeight: 118 }}>
              <Emoji e={o.e} size={36} box={64} radius={18} bg={`hsl(${o.hue} 80% 60% / 0.16)`} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Tag hue={o.hue}>{o.tag}</Tag>
                <div
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 600,
                    fontSize: 32,
                    lineHeight: 1.12,
                    letterSpacing: "-0.01em",
                    color: C.text,
                  }}
                >
                  {o.title}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <OtherButton g={g} tapAt={i === 0 ? 498 : undefined} pulseAt={o.pulseAt} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
