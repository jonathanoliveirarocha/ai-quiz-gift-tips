import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT_BODY } from "../theme";
import { EASE_IN, prog, sp } from "../anim";
import { Phone } from "../components/Phone";
import {
  LoadingScreen,
  QuizTopBar,
  ResultScreen,
  ScreenBudget,
  ScreenLikes,
  ScreenRelation,
  ScreenSaturday,
} from "../components/Screens";
import { Hi, HandUnderline, Line, SUPPORT, TextBlock } from "../components/Text";
import { LinkIcon } from "../components/Icons";

/** Celular das cenas 3 a 6 (frames 132 a 551): entra uma vez e troca de tela conforme o frame. */
export const PhoneDemo: React.FC = () => {
  const g = useCurrentFrame() + 132;
  const pIn = sp(g, 132, { damping: 16, stiffness: 110 });
  const out = prog(g, 540, 552, EASE_IN);
  return (
    <Phone
      headerBg={prog(g, 448, 458)}
      style={{
        translate: `0px ${1400 * (1 - pIn) + 300 * out}px`,
        rotate: `${6 * (1 - pIn)}deg`,
        scale: 1 - 0.08 * out,
        opacity: 1 - out,
      }}
    >
      {g < 326 ? <QuizTopBar g={g} /> : null}
      {g < 192 ? <ScreenRelation g={g} /> : null}
      {g >= 190 && g < 226 ? <ScreenBudget g={g} /> : null}
      {g >= 224 && g < 274 ? <ScreenLikes g={g} /> : null}
      {g >= 272 && g < 306 ? <ScreenSaturday g={g} /> : null}
      {g >= 316 && g < 366 ? <LoadingScreen g={g} /> : null}
      {g >= 356 ? <ResultScreen g={g} /> : null}
    </Phone>
  );
};

/** Degradê na base (cenas 3 a 6): esconde o pé do celular e limpa a área da legenda do Instagram. */
export const BottomFade: React.FC = () => {
  const g = useCurrentFrame() + 132;
  const o = prog(g, 132, 144) * (1 - prog(g, 540, 552));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1440,
          height: 480,
          background: `linear-gradient(to bottom, rgba(15,10,31,0) 0%, ${C.bg} 62%, ${C.bg} 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Cena 3: responda (frames 132 a 263). */
export const Scene3: React.FC = () => {
  const g = useCurrentFrame() + 132;
  return (
    <TextBlock top={270}>
      <Line g={g} inAt={136} outAt={256} style={{ fontSize: 100 }}>
        Responda sobre
      </Line>
      <Line g={g} inAt={141} outAt={258} style={{ fontSize: 100 }}>
        a{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          pessoa
          <HandUnderline p={prog(g, 150, 162)} />
        </span>
      </Line>
      <Line g={g} inAt={168} outAt={260} style={{ ...SUPPORT, marginTop: 34 }}>
        É só tocar nas opções
      </Line>
    </TextBlock>
  );
};

/** Cena 4: pode pular (frames 264 a 323). */
export const Scene4: React.FC = () => {
  const g = useCurrentFrame() + 264;
  return (
    <TextBlock top={290}>
      <Line g={g} inAt={266} outAt={316} style={{ fontSize: 120 }}>
        Não sabe?
      </Line>
      <Line g={g} inAt={272} outAt={318} style={{ fontSize: 120 }}>
        Pode <span style={{ fontStyle: "italic", color: C.mint, textShadow: "0 0 40px rgba(95,242,195,.35)" }}>pular</span>.
      </Line>
    </TextBlock>
  );
};

/** Cena 5: o presente ideal (frames 324 a 458, a saída invade a cena 6). */
export const Scene5: React.FC = () => {
  const g = useCurrentFrame() + 324;
  return (
    <TextBlock top={290}>
      <Line g={g} inAt={328} outAt={450} style={{ fontSize: 96 }}>
        O presente{" "}
        <Hi g={g} shineAt={366}>
          ideal
        </Hi>
      </Line>
      <Line g={g} inAt={392} outAt={452} style={{ ...SUPPORT, marginTop: 18 }}>
        e por que ele combina
      </Line>
    </TextBlock>
  );
};

/** Cena 6: outras ideias (frames 450 a 551). */
export const Scene6: React.FC = () => {
  const g = useCurrentFrame() + 450;
  return (
    <TextBlock top={270}>
      <Line g={g} inAt={456} outAt={540} style={{ fontSize: 100 }}>
        Outras{" "}
        <Hi g={g} shineAt={476}>
          ideias
        </Hi>
      </Line>
      <Line g={g} inAt={461} outAt={542} style={{ ...SUPPORT, marginTop: 14 }}>
        no mesmo orçamento
      </Line>
      <Line
        g={g}
        inAt={502}
        outAt={544}
        style={{
          fontFamily: FONT_BODY,
          fontWeight: 800,
          fontSize: 44,
          letterSpacing: "-0.01em",
          color: C.mint,
          marginTop: 18,
          display: "flex",
          alignItems: "center",
          gap: 14,
          textShadow: "0 0 30px rgba(95,242,195,.3)",
        }}
      >
        <LinkIcon size={44} stroke={2.6} />
        Cada uma com link pro produto
      </Line>
    </TextBlock>
  );
};
