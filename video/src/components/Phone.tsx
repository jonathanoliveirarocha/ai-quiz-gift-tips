import { C, FONT_BODY } from "../theme";
import { GiftBox, Wordmark } from "./Logo";

// Posição final do celular no quadro (canto superior esquerdo em 160, 610).
export const PHONE = { x: 160, y: 610, w: 700, h: 1440, border: 3, inset: 16 };
// Origem da tela em coordenadas do quadro (usada para mirar os toques).
export const SCREEN = { x: PHONE.x + PHONE.inset, y: PHONE.y + PHONE.inset, w: PHONE.w - PHONE.inset * 2 };

/** Moldura do celular com barra de status e cabeçalho do site. O conteúdo usa coordenadas da tela. */
export const Phone: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; headerBg?: number }> = ({
  children,
  style,
  headerBg = 0,
}) => (
  <div
    style={{
      position: "absolute",
      left: PHONE.x,
      top: PHONE.y,
      width: PHONE.w,
      height: PHONE.h,
      borderRadius: 96,
      background: "#0b0716",
      border: `${PHONE.border}px solid rgba(255,255,255,.14)`,
      boxShadow: "0 40px 120px rgba(0,0,0,.6), 0 0 160px rgba(255,79,179,0.16)",
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: PHONE.inset - PHONE.border,
        borderRadius: 82,
        overflow: "hidden",
        background: C.bg,
      }}
    >
      {/* manchas do fundo do site, em tamanho menor */}
      <div
        style={{
          position: "absolute",
          left: -220,
          top: -200,
          width: 560,
          height: 560,
          borderRadius: "50%",
          background: C.pink,
          opacity: 0.22,
          filter: "blur(100px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -240,
          top: 520,
          width: 560,
          height: 560,
          borderRadius: "50%",
          background: C.violet,
          opacity: 0.26,
          filter: "blur(100px)",
        }}
      />
      {/* fundo do topo: o conteúdo rolado passa por baixo da barra de status e do logo */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 140,
          zIndex: 8,
          opacity: headerBg,
          background: "linear-gradient(to bottom, rgba(22,13,40,1) 0%, rgba(20,12,37,.97) 82%, rgba(15,10,31,0) 100%)",
        }}
      />
      {/* barra de status */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 56,
          fontFamily: FONT_BODY,
          fontWeight: 700,
          fontSize: 26,
          color: C.text,
          zIndex: 10,
        }}
      >
        <span style={{ position: "absolute", left: 58, top: 16 }}>9:41</span>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 10,
            width: 180,
            height: 44,
            marginLeft: -90,
            borderRadius: 999,
            background: "#000",
          }}
        />
        <div style={{ position: "absolute", right: 52, top: 22, display: "flex", gap: 8, alignItems: "flex-end" }}>
          {[8, 12, 16, 20].map((h) => (
            <span key={h} style={{ width: 5, height: h, borderRadius: 2, background: C.text, marginTop: 20 - h }} />
          ))}
          <span
            style={{
              marginLeft: 8,
              width: 38,
              height: 20,
              borderRadius: 6,
              border: `2px solid ${C.text}`,
              padding: 2,
            }}
          >
            <span style={{ display: "block", width: "78%", height: "100%", borderRadius: 3, background: C.text }} />
          </span>
        </div>
      </div>
      {/* cabeçalho do site */}
      <div
        style={{
          position: "absolute",
          left: 28,
          top: 66,
          height: 56,
          display: "flex",
          alignItems: "center",
          gap: 12,
          zIndex: 10,
        }}
      >
        <GiftBox size={40} id="phone-logo" />
        <Wordmark size={34} />
      </div>
      <div style={{ position: "absolute", inset: 0, zIndex: 5 }}>{children}</div>
    </div>
  </div>
);
