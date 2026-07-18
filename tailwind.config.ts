import type { Config } from "tailwindcss";

// Design tokens map to CSS variables (see globals.css). Font-size scaling uses
// the `[data-font-size]` attribute on <html>.
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        text: "var(--text)",
        muted: "var(--text-muted)",
        border: "var(--border)",
        primary: "var(--primary)",
        "primary-dark": "var(--primary-dark)",
        // Saffron is reserved — only the ePaper strip may use it. ponytail: kept
        // as a token so the design-audit grep can confirm it appears nowhere else.
        saffron: "var(--saffron)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        container: "1200px",
      },
      zIndex: {
        dropdown: "20",
        sticky: "30",
        "modal-backdrop": "40",
        modal: "50",
        toast: "60",
        tooltip: "70",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "pulse-dot": "pulse 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
