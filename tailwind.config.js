/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#414ba4",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#8291ae",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#f1f5f9",
          foreground: "#64748b",
        },
        accent: {
          DEFAULT: "#d1d3e5",
          foreground: "#262626",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#262626",
        },
        teal: {
          DEFAULT: "#a9e8e8",
          foreground: "#262626",
        },
        purple: {
          DEFAULT: "#d2ccf2",
          foreground: "#262626",
        },
        yellow: {
          DEFAULT: "#f5e2a0",
          foreground: "#262626",
        },
        slate: {
          DEFAULT: "#8291ae",
          foreground: "#ffffff",
        },
        dark: {
          DEFAULT: "#222227",
          foreground: "#ffffff",
        },
        light: {
          DEFAULT: "#fffdf8",
          foreground: "#333333",
        },
      },
      gradientColorStops: {
        "splash-start": "#414ba4",
        "splash-end": "#e779a5",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
