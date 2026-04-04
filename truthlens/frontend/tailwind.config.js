/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        syne: ["'Syne'", "sans-serif"],
        dm: ["'DM Sans'", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
      },
      colors: {
        bg: { deep: "#080810", base: "#0f0f1a", surface: "#16162a" },
        clay: { DEFAULT: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.12)", subtle: "rgba(255,255,255,0.07)" },
        text: { primary: "#eeeaf5", secondary: "#b8b4cc", muted: "#7a7890" },
        accent: {
          purple: "#a855f7", violet: "#818cf8",
          green: "#4ade80",  red: "#f87171",
          amber: "#fb923c",  yellow: "#facc15",
          blue: "#38bdf8",   teal: "#2dd4bf"
        }
      },
      borderRadius: {
        clay: "24px", clayLg: "32px", claySm: "16px", pill: "9999px"
      },
      boxShadow: {
        clay: "0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.18)",
        clayGreen: "0 8px 32px rgba(0,0,0,0.45), 0 0 28px rgba(74,222,128,0.18), inset 0 1px 0 rgba(255,255,255,0.18)",
        clayRed: "0 8px 32px rgba(0,0,0,0.45), 0 0 28px rgba(248,113,113,0.18), inset 0 1px 0 rgba(255,255,255,0.18)",
        clayAmber: "0 8px 32px rgba(0,0,0,0.45), 0 0 28px rgba(251,146,60,0.18), inset 0 1px 0 rgba(255,255,255,0.18)",
        clayYellow: "0 8px 32px rgba(0,0,0,0.45), 0 0 28px rgba(250,204,21,0.18), inset 0 1px 0 rgba(255,255,255,0.18)",
        clayPurple: "0 8px 32px rgba(0,0,0,0.45), 0 0 28px rgba(168,85,247,0.20), inset 0 1px 0 rgba(255,255,255,0.18)",
        clayBtn: "0 6px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)"
      }
    },
  },
  plugins: [],
}
