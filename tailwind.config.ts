import type { Config } from "tailwindcss";

/**
 * Sistema de diseño FS — Francis Salazar
 * Estética: editorial · soft luxury · serena · femenina
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Base crema / blanco
        cream: "#FDFBF8", // fondo principal
        // Neutro cálido muy suave, con leve matiz lila (bordes y fondos sutiles)
        sand: {
          50: "#F9F6FB",
          100: "#F2EDF4",
          200: "#E7DFEA",
          300: "#D6C9DA",
          400: "#BBA9C2",
          500: "#9683A0",
        },
        // Lila (acento principal de la identidad)
        lavender: {
          50: "#F7F4FB",
          100: "#EEE8F6",
          200: "#DED2ED",
          300: "#C6B4DD",
          400: "#A98FC8",
          500: "#9e7cd3",
          // Tonos profundos: fondo sólido de los botones principales
          // (identidad lila) y su estado hover. Contraste verificado
          // (>4.5:1) con texto blanco encima.
          600: "#9175c0",
          700: "#d4a2ca",
        },
        // Lila muy oscuro para hover de botones oscuros
        stone: {
          950: "#241A33",
        },
        ink: "#382C4C", // texto principal y elementos oscuros: lila profundo
        muted: "#6F6579", // texto secundario: gris malva
        // Dorado (acento cálido de la identidad)
        gold: {
          300: "#E7D3A8",
          400: "#D8BC82",
          500: "#C6A45E",
          600: "#AC8846",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": [
          "clamp(2.75rem, 6vw, 5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.02em" },
        ],
        "display-lg": [
          "clamp(2.25rem, 4.5vw, 3.75rem)",
          { lineHeight: "1.1", letterSpacing: "-0.015em" },
        ],
        "display-md": [
          "clamp(1.75rem, 3vw, 2.5rem)",
          { lineHeight: "1.15", letterSpacing: "-0.01em" },
        ],
      },
      maxWidth: {
        content: "72rem",
        prose: "42rem",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(56, 44, 76, 0.07)",
        lifted: "0 20px 60px rgba(56, 44, 76, 0.12)",
        gold: "0 10px 40px rgba(198, 164, 94, 0.25)",
        lila: "0 10px 40px rgba(139, 92, 246, 0.22)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
