/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#171425", 70: "#4A4459", 45: "#7C7689", 20: "#B6B1C2" },
        line: "#E4E1EC",
        canvas: "#F3F1F8",
        surface: "#FFFFFF",
        violet: { DEFAULT: "#5B3DF5", soft: "#EEEAFE", deep: "#3D24C4" },
        marigold: { DEFAULT: "#F08000", soft: "#FFF1E0", deep: "#B35E00" },
        jade: { DEFAULT: "#0E9F6E", soft: "#E4F6EF", deep: "#0B7A54" },
        rose: { DEFAULT: "#E0396E", soft: "#FDE7EF" },
      },
      fontFamily: {
        display: ["'Bricolage Grotesque'", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["'Instrument Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      letterSpacing: { tightest: "-0.045em" },
      borderRadius: { "2xl": "1rem", "3xl": "1.375rem" },
      boxShadow: {
        lift: "0 10px 30px rgba(23,20,37,0.06)",
        pop: "0 24px 60px rgba(23,20,37,0.14)",
        drawer: "-20px 0 60px rgba(23,20,37,0.14)",
      },
      keyframes: {
        shimmer: { from: { backgroundPosition: "200% 0" }, to: { backgroundPosition: "-200% 0" } },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
      },
      animation: {
        shimmer: "shimmer 1.1s linear infinite",
        "fade-in": "fade-in 0.45s ease-out both",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};
