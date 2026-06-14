import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./src/content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Gordon Sales Guru brand palette
        navy: "#042C53", // primary
        blue: "#185FA5", // secondary
        sky: "#E6F1FB", // light background
        accent: "#378ADD", // accent
        ink: "#1a1a1a", // body text
        whatsapp: "#25D366", // WhatsApp green CTA
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "8px",
        pill: "99px",
      },
      maxWidth: {
        container: "1280px",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(37,211,102,0.5)" },
          "70%": { transform: "scale(1)", boxShadow: "0 0 0 12px rgba(37,211,102,0)" },
          "100%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(37,211,102,0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2s infinite",
        "fade-in-up": "fade-in-up 0.5s ease-out both",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
