import { AbsoluteFill, Sequence } from "remotion";
import { C } from "./theme";
import { Background } from "./components/Background";
import { Cursor } from "./components/Cursor";
import { HeroBox, Scene1, Scene2 } from "./scenes/Intro";
import { BottomFade, PhoneDemo, Scene3, Scene4, Scene5, Scene6 } from "./scenes/Demo";
import { Scene7, Scene8 } from "./scenes/Outro";

export const GLOBAL_CSS = `*{box-sizing:border-box;-webkit-font-smoothing:antialiased}`;

/**
 * Reels do Mimo Certo: 1080x1920, 30 fps, 735 frames (24,5 s).
 * Roteiro completo em ROTEIRO.md. Os frames de cada cena seguem a tabela do roteiro.
 */
export const MimoCertoReels: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <style>{GLOBAL_CSS}</style>
    <Background />

    <Sequence name="Caixinha e logo (cenas 1 e 2)" durationInFrames={132}>
      <HeroBox />
    </Sequence>
    <Sequence name="Cena 1 · Gancho" durationInFrames={60}>
      <Scene1 />
    </Sequence>
    <Sequence name="Cena 2 · Virada" from={60} durationInFrames={72}>
      <Scene2 />
    </Sequence>

    <Sequence name="Celular (cenas 3 a 6)" from={132} durationInFrames={420}>
      <PhoneDemo />
    </Sequence>
    <Sequence name="Degradê da base" from={132} durationInFrames={420}>
      <BottomFade />
    </Sequence>
    <Sequence name="Cena 3 · Responda" from={132} durationInFrames={132}>
      <Scene3 />
    </Sequence>
    <Sequence name="Cena 4 · Pode pular" from={264} durationInFrames={60}>
      <Scene4 />
    </Sequence>
    <Sequence name="Cena 5 · Presente ideal" from={324} durationInFrames={135}>
      <Scene5 />
    </Sequence>
    <Sequence name="Cena 6 · Outras ideias" from={450} durationInFrames={102}>
      <Scene6 />
    </Sequence>

    <Sequence name="Cena 7 · Benefícios" from={552} durationInFrames={81}>
      <Scene7 />
    </Sequence>
    <Sequence name="Cena 8 · Chamada final" from={633} durationInFrames={102}>
      <Scene8 />
    </Sequence>

    <Cursor />
  </AbsoluteFill>
);
