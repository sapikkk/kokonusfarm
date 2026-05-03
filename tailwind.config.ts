import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
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
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // =====================
        // Fimet Palette Tokens
        // =====================
        lime: {
          50: '#f4fded',
          100: '#e6f9d4',
          200: '#cdf3a8',
          300: '#B7F192',
          400: '#9FE870',   // ← BASE brand lime
          500: '#86D156',
          600: '#5ab830',
          700: '#459424',
          800: '#35711b',
          900: '#234a14',
        },
        forest: {
          50: '#edf8f5',
          100: '#d1ede6',
          200: '#a3dace',
          300: '#6bbfac',
          400: '#399e8a',
          500: '#207a6b',
          600: '#145f52',
          700: '#0d4b40',
          800: '#0A3D35',   // ← forest-800
          900: '#062F28',   // ← BASE dark forest
          950: '#031a17',
        },
        // Keep botanical for legacy components
        botanical: {
          50: '#f4fded',
          100: '#e6f9d4',
          200: '#cdf3a8',
          300: '#9FE870',
          400: '#7bd64d',
          500: '#5ab830',
          600: '#459424',
          700: '#35711b',
          800: '#2c5a17',
          900: '#234a14',
          950: '#062F28',
        },
        neutral: {
          0: '#FFFFFF',
          50: '#F9F9F9',
          100: '#F2F2F2',
          200: '#E0E0E0',
          300: '#B0B0B0',
          400: '#808080',
          500: '#666666',
          600: '#4D4D4D',
          700: '#333333',
          800: '#111111',
          900: '#000000',
        },
        gray: {
          muted: '#7B7B7B',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.25rem",
      },
      fontFamily: {
        sans: ['Space Grotesk', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      fontSize: {
        'display': ['48px', { lineHeight: '1', fontWeight: '900', letterSpacing: '-0.05em' }],
        'h1': ['36px', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.04em' }],
        'h2': ['28px', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.03em' }],
        'h3': ['22px', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '-0.02em' }],
        'h4': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['14px', { lineHeight: '1.7' }],
        'small': ['12px', { lineHeight: '1.5' }],
        'caption': ['10px', { lineHeight: '1.4', letterSpacing: '0.04em' }],
        'overline': ['9px', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '0.18em' }],
      },
      boxShadow: {
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
        "slide-in": {
          from: { transform: "translateX(-20px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "fade-up": {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "count-up": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "toast-in": {
          from: { transform: "translateX(20px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "shimmer": {
          "0%": { backgroundPoadminon: "200% center" },
          "100%": { backgroundPoadminon: "-200% center" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "fade-up": "fade-up 0.4s ease-out",
        "count-up": "count-up 0.5s ease-out",
        "toast-in": "toast-in 0.3s ease",
        "shimmer": "shimmer 1.8s infinite",
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
