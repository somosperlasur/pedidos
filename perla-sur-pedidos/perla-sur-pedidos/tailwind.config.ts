import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Perla Sur brand palette (sampled from somosperlasur.com and the logo files)
        paper: "#F7E6D5", // page background — light peachy cream
        navPeach: "#F2DAC4", // header strip / deeper cream
        surface: "#FFFFFF", // cards
        surfaceRaised: "#F0DEC5", // inputs / raised fields
        border: "#E3C9A8", // warm tan borders
        ink: "#23332F", // primary text — dark teal-charcoal
        muted: "#748883", // secondary text — muted sage
        orange: "#E85319", // primary accent (their CTA / heading color)
        teal: "#05625B", // secondary accent
        forest: "#303923", // dark olive green (their hero/header color)
        logoPeach: "#F3D1BA", // the wordmark's peach tone, for use on dark bg
        danger: "#B3261E", // errors / delete actions (kept separate from brand green)

        // legacy token names kept as aliases so existing classes still work
        cream: "#23332F",
        turmeric: "#E85319",
        herb: "#05625B",
        achiote: "#303923",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.6) inset, 0 8px 20px -14px rgba(48,57,35,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;

