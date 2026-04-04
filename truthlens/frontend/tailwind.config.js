/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        bebas: ["'Bebas Neue'", "sans-serif"],
        'dm-mono': ["'DM Mono'", "monospace"],
        'instrument': ["'Instrument Serif'", "serif"],
        // Keep existing if needed, but the ones above are required by Prompt 6
        mono: ["'DM Mono'", "monospace"],
        serif: ["'Instrument Serif'", "serif"],
      },
      colors: {
        // Base variables (from var)
        bg: "var(--bg)",
        surface: "var(--surface)",
        border: "var(--border)",
        text: "var(--text)",
        muted: "var(--muted)",
        
        // Editorial Palette (New in Phase 2)
        editorial: {
          bg: '#0d0d0d',
          surface: '#141414',
          border: '#222222',
          text: '#f0ede8',
          muted: '#666666',
        },
        
        // Verdict Palette (New in Phase 2)
        verdict: {
          real: '#47ff8f',
          fake: '#ff4747',
          misleading: '#ff9147',
          mixed: '#e8ff47',
          gray: '#666666',
          // Keep legacy logic if any old component uses these
          green: "#47ff8f",
          red: "#ff4747",
          amber: "#ff9147",
          yellow: "#e8ff47",
        }
      }
    },
  },
  plugins: [],
}
