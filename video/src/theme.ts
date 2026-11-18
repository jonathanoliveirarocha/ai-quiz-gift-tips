import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadEmoji } from "@remotion/google-fonts/NotoColorEmoji";

// Mesmas fontes do site (frontend/src/styles.css). A Noto Color Emoji deixa os
// emojis iguais em qualquer máquina que renderizar o vídeo.
const fraunces = loadFraunces("normal", { weights: ["600", "700"], subsets: ["latin"] });
loadFraunces("italic", { weights: ["600", "700"], subsets: ["latin"] });
const jakarta = loadJakarta("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin"] });
const caveat = loadCaveat("normal", { weights: ["700"], subsets: ["latin"] });
const emoji = loadEmoji("normal", { weights: ["400"], subsets: ["emoji"] });

export const FONT_EMOJI = emoji.fontFamily;
export const FONT_DISPLAY = `${fraunces.fontFamily}, ${emoji.fontFamily}, Georgia, serif`;
export const FONT_BODY = `${jakarta.fontFamily}, ${emoji.fontFamily}, "Segoe UI", sans-serif`;
export const FONT_HAND = `${caveat.fontFamily}, cursive`;

// Paleta do site.
export const C = {
  bg: "#0f0a1f",
  bg2: "#180f2e",
  text: "#f7f2ff",
  muted: "#bdb2dc",
  soft: "#8d82b0",
  ink: "#1b1030",
  coral: "#ff7a6b",
  pink: "#ff4fb3",
  violet: "#8b6cff",
  gold: "#ffd36e",
  mint: "#5ff2c3",
  glass: "rgba(255, 255, 255, 0.055)",
  border: "rgba(255, 255, 255, 0.12)",
  borderStrong: "rgba(255, 255, 255, 0.24)",
};

export const GRAD = `linear-gradient(135deg, ${C.coral} 0%, ${C.pink} 50%, ${C.violet} 100%)`;
