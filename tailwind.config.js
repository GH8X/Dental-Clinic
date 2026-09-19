/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        // Deep clinical teal-navy: headings, footer, dark surfaces
        ink: {
          50: "#F1F6F7",
          100: "#DCE8EA",
          200: "#B9D1D6",
          300: "#8CB0B8",
          400: "#5C8A95",
          500: "#3E6C78",
          600: "#2E555F",
          700: "#26454E",
          800: "#1C363D",
          900: "#0B252B",
        },
        // Soft teal - primary brand accent
        brand: {
          50: "#EFFAF8",
          100: "#D5F2EE",
          200: "#ADE5DF",
          300: "#7BD1CB",
          400: "#46B4AE",
          500: "#229793",
          600: "#127C79",
          700: "#0F6361",
          800: "#104F4E",
          900: "#103F3F",
        },
        // Soft clinical blue - secondary accent
        accent: {
          50: "#F0F8FD",
          100: "#DCEFFA",
          200: "#BBDEF4",
          300: "#8AC7EB",
          400: "#52A9DE",
          500: "#2C8DC9",
          600: "#1D71A9",
          700: "#1A5B88",
          800: "#1A4C71",
          900: "#19405F",
        },
        mist: "#F6FBFC",
        "mist-dark": "#EDF6F8",
      },
      fontFamily: {
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ['"Fraunces"', "Georgia", "Cambria", "Times New Roman", "serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(11,37,43,0.04), 0 10px 30px -14px rgba(11,37,43,0.16)",
        card: "0 1px 3px rgba(11,37,43,0.04), 0 22px 48px -28px rgba(11,37,43,0.28)",
        lift: "0 2px 6px rgba(11,37,43,0.05), 0 38px 70px -34px rgba(11,37,43,0.36)",
        glow: "0 18px 40px -18px rgba(34,151,147,0.55)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%": { transform: "scale(1.5)", opacity: "0" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
        float: "float 6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
        marquee: "marquee 34s linear infinite",
      },
      backgroundImage: {
        "grid-soft":
          "linear-gradient(to right, rgba(11,37,43,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,37,43,0.045) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
