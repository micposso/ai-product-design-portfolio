import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/streamdown/dist/*.js",
  ],
  theme: {
    fontFamily: {
      sans: ["var(--font-body)", "sans-serif"],
      mono: ["JetBrains Mono", "Menlo", "monospace"],
    },
    extend: {
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.07)",
        raised: "0 4px 16px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)",
        focus: "0 0 0 3px rgba(75,175,110,0.25)",
        "card-dark":
          "0 1px 3px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(255,255,255,0.06)",
        "raised-dark":
          "0 4px 16px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.05)",
        "focus-dark": "0 0 0 3px rgba(144,144,144,0.25)",
      },
      colors: {
        brand: {
          deep: "#1A3A22",
          DEFAULT: "#2D6B47",
          mid: "#4BAF6E",
          tint: "#C8EDD7",
          surface: "#EBF7EF",
        },
        surface: {
          page: "#F5F3EE",
          card: "#FAFAF8",
          raised: "#FFFFFF",
        },
        neutral: {
          900: "#1C1C1A",
          700: "#4A4A47",
          500: "#9A9892",
          300: "#C8C6BE",
          200: "#E4E2DB",
          100: "#F0EEE9",
          50: "#F5F3EE",
        },
        status: {
          "blocking-bg": "#FDECEA",
          blocking: "#E84C2B",
          "blocking-dark": "#C0351E",
          "urgent-bg": "#FEF3DC",
          urgent: "#F0A830",
          "urgent-dark": "#B87A18",
          "essential-bg": "#E8F0FC",
          essential: "#3A7ED9",
          "essential-dark": "#1F5CB5",
        },
        dark: {
          950: "#0A0A0A",
          900: "#111111",
          800: "#1A1A1A",
          700: "#242424",
          600: "#2E2E2E",
          500: "#3D3D3D",
          400: "#5A5A5A",
          300: "#878787",
          200: "#B0B0B0",
          100: "#D4D4D4",
          50: "#F0F0F0",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  safelist: ["w-32", "w-44", "w-52"],
};
export default config;
