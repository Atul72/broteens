import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        lavender: {
          50: "#FAF7FD",
          100: "#F4EEFB",
          200: "#E9DCF8",
          300: "#D6BFF2",
          400: "#BD9AE8",
          500: "#A370DF",
          600: "#8646D8", // Signature Lavender Accent
          700: "#7333C4",
          800: "#5F29A3",
          900: "#4E2385",
          950: "#32125B",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        "lavender-glow": "0 10px 30px -10px rgba(134, 70, 216, 0.35)",
        "lavender-sm": "0 4px 14px 0 rgba(134, 70, 216, 0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
