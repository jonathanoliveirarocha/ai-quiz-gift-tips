import { AbsoluteFill } from "remotion";
import { C } from "./theme";
import { GiftBox } from "./components/Logo";

/** Foto de perfil do Instagram (1080x1080): caixinha do logo no centro, segura para o recorte em círculo. */
export const Profile: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 50% 50%, rgba(255,79,179,.38) 0%, rgba(139,108,255,.22) 38%, ${C.bg} 70%)`,
      backgroundColor: C.bg,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <GiftBox
      size={620}
      id="profile-box"
      style={{ marginTop: 40, filter: "drop-shadow(0 0 60px rgba(255,79,179,.55))" }}
    />
  </AbsoluteFill>
);
