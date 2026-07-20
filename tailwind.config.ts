import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        royal: {
          DEFAULT: "#0057FF",
          50: "#EAF0FF",
          100: "#D2E0FF",
          400: "#3A78FF",
          500: "#0057FF",
          600: "#0044CC",
          700: "#003399",
        },
        navy: {
          DEFAULT: "#0A1330",
          800: "#101A3D",
          900: "#0A1330",
        },
        sky: {
          accent: "#5FB6FF",
        },
      },
      backgroundImage: {
        "blue-gradient": "linear-gradient(135deg, #0057FF 0%, #3A78FF 50%, #5FB6FF 100%)",
        "hero-gradient":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,87,255,0.15), transparent), linear-gradient(180deg, #FFFFFF 0%, #F5F8FF 100%)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(10, 19, 48, 0.08)",
        "soft-lg": "0 20px 60px rgba(10, 19, 48, 0.12)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
