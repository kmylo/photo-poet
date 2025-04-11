import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Using HSL values similar to daisyUI dark theme
        background: "hsl(222, 47%, 11%)",
        foreground: "hsl(210, 40%, 98%)",
        primary: "hsl(248, 85%, 63%)",   // Purple
        secondary: "hsl(327, 84%, 64%)", // Pink
        accent: "hsl(167, 76%, 57%)",    // Teal/Cyan
        neutral: "hsl(0, 0%, 20%)",      // Dark Gray
        info: "hsl(204, 82%, 58%)",       // Light Blue
        success: "hsl(141, 71%, 48%)",    // Green
        warning: "hsl(45, 100%, 50%)",    // Yellow
        error: "hsl(0, 91%, 63%)",        // Red
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#800080",

          "secondary": "#f000b8",

          "accent": "#ffcc00",

          "neutral": "#292A33",

          "base-100": "#2D3038",

          "info": "#3abff8",

          "success": "#36d399",

          "warning": "#fbbd23",

          "error": "#f87272",
        },
      },
    ],
  },
} satisfies Config;
