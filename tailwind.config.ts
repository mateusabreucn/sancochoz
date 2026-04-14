import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#E8E6E1",
        "bg-alt": "#DDDBD6",
        black: "#0A0A0A",
        accent: "#F5C500",
        "accent-tape": "#E8B800",
        "text-muted": "#9A9A9A",
        border: "#D0CEC9",
        "header-bg": "#FFFFFF",
      },
      fontFamily: {
        body: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-anton)", "sans-serif"],
        display: ["var(--font-permanent-marker)", "cursive"],
      },
      spacing: {
        "page-x": "clamp(1.5rem, 5vw, 5rem)",
        header: "64px",
      },
      maxWidth: {
        page: "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
