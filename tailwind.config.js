export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--bg)",
        foreground: "var(--text)",
        accent: "var(--accent)",
      },
      fontFamily: {
        sans: ["Inter Variable", "sans-serif"],
        display: ["Space Grotesk Variable", "sans-serif"],
        serif: ["Fraunces Variable", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
