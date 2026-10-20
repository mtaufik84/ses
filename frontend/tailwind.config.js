/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        muted: "hsl(var(--muted))",
        border: "hsl(var(--border))",
        porcelain: {
          DEFAULT: "#FFFCF4",
          50: "#FFFFFF",
          100: "#FFFCF4",
          200: "#FDF7EB",
          300: "#F7EDE0",
          400: "#EDE0CD",
        },
        brand: {
          50: "#FFF8F2",
          100: "#FFF0E5",
          200: "#FEDAC4",
          300: "#FDB894",
          400: "#FC8D55",
          500: "#FF6115",
          600: "#EA4E00",
          700: "#C23E00",
          800: "#9A3412",
          900: "#7C2D12",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
