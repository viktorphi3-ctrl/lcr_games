import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: "#00e6e6",
          magenta: "#ff1a75",
          bg: "#0a0a0a",
          surface: "#111111",
          card: "#161616",
          border: "#1e1e1e",
          text: "#e0e0e0",
          muted: "#666666",
          "cyan-dim": "#00b3b3",
          "magenta-dim": "#cc1560",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        orbitron: ["Orbitron", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "neon-gradient": "linear-gradient(135deg, #00e6e6, #ff1a75)",
        "neon-gradient-r": "linear-gradient(135deg, #ff1a75, #00e6e6)",
        "surface-gradient": "linear-gradient(180deg, #161616 0%, #0a0a0a 100%)",
      },
      boxShadow: {
        "neon-cyan": "0 0 20px rgba(0, 230, 230, 0.4), 0 0 40px rgba(0, 230, 230, 0.1)",
        "neon-magenta": "0 0 20px rgba(255, 26, 117, 0.4), 0 0 40px rgba(255, 26, 117, 0.1)",
        "neon-cyan-sm": "0 0 10px rgba(0, 230, 230, 0.3)",
        "neon-magenta-sm": "0 0 10px rgba(255, 26, 117, 0.3)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
