import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#173b35",
        field: "#f5f7f2",
        clay: "#e67445",
        palm: "#1f8a70",
        maize: "#e5b84b",
        river: "#2d78a0",
      },
      boxShadow: {
        soft: "0 18px 48px rgba(23, 59, 53, 0.12)",
      },
    },
  },
  plugins: [],
} satisfies Config;
