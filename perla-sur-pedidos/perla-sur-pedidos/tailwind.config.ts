import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0A",
        surface: "#161310",
        surfaceRaised: "#1E1912",
        border: "#2E2820",
        cream: "#F2EDE2",
        muted: "#A79A85",
        turmeric: "#C9A227",
        herb: "#8A9A5B",
        achiote: "#B5482A",
      },
      fontFamily: {
        display: [
          "Iowan Old Style",
          "Palatino Linotype",
          "URW Palladio L",
          "P052",
          "serif",
        ],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(242,237,226,0.04) inset, 0 8px 20px -12px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};
export default config;
