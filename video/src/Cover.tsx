import { AbsoluteFill } from "remotion";
import { C, FONT_DISPLAY } from "./theme";
import { Background } from "./components/Background";
import { GiftBox } from "./components/Logo";
import { Hand, Hi, TextBlock, TITLE } from "./components/Text";
import { GLOBAL_CSS } from "./MimoCertoReels";

/**
 * Capa do Reels (imagem 1080x1920). Tudo importante fica entre y 285 e 1250,
 * faixa que sobrevive ao recorte da grade do perfil (3:4) e do feed (4:5).
 */
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <style>{GLOBAL_CSS}</style>
    <Background />
    <TextBlock top={300} left={80} width={920}>
      <div style={{ ...TITLE, fontSize: 128, whiteSpace: "normal" }}>
        Não sabe
        <br />o que dar
        <br />
        de <Hi g={0}>presente?</Hi>
      </div>
    </TextBlock>
    <div
      style={{
        position: "absolute",
        left: 540 - 150,
        top: 740,
        width: 300,
        height: 300,
        rotate: "-6deg",
        filter: "drop-shadow(0 0 60px rgba(255,79,179,.5))",
      }}
    >
      <GiftBox size={300} id="cover-box" lidLift={30} lidRotate={-12} />
    </div>
    {[
      { color: C.gold, x: 330, y: 790, r: -14 },
      { color: C.mint, x: 770, y: 770, r: 12 },
      { color: C.pink, x: 760, y: 1010, r: 10 },
    ].map((q) => (
      <div
        key={q.color}
        style={{
          position: "absolute",
          left: q.x,
          top: q.y,
          translate: "-50% -50%",
          rotate: `${q.r}deg`,
          fontFamily: FONT_DISPLAY,
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: 130,
          lineHeight: 1,
          color: q.color,
          textShadow: `0 0 40px ${q.color}88`,
        }}
      >
        ?
      </div>
    ))}
    <div style={{ position: "absolute", left: 0, width: 1080, top: 1100, display: "flex", justifyContent: "center" }}>
      <Hand g={2} from={0} to={1} size={80} rotate={-3}>
        a IA descobre em 2 minutos
      </Hand>
    </div>
  </AbsoluteFill>
);
