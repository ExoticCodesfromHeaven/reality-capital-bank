import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],

  content: ["./index.html", "./src/**/*.{ts,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: "#0B1F3A",

        secondary: "#1E40AF",

        accent: "#D4AF37",

        background: "#F8FAFC",

        muted: "#64748B",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      borderRadius: {
        xl: "14px",
        "2xl": "18px",
      },

      boxShadow: {
        card: "0 8px 24px rgba(15,23,42,.08)",

        navbar: "0 2px 10px rgba(15,23,42,.06)",
      },
    },
  },

  plugins: [],
};

export default config;
