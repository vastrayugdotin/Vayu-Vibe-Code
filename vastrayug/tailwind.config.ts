import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Primary Brand Palette ───────────────────────────
        'cosmic-black':   '#0A0A0F',
        'nebula-gold':    '#C9A84C',
        'stardust-white': '#F4F1EC',
        'deep-indigo':    '#1B1640',
        // ── Extended Palette ────────────────────────────────
        'eclipse-silver': '#A8A9AD',
        'astral-purple':  '#4B0082',
        'celestial-blue': '#003087',
        'void-black':     '#050507',
        // ── Navagraha Planet Accents ─────────────────────────
        'surya-gold':     '#D4A017',  // Sun
        'surya-saffron':  '#F4622C',
        'chandra-pearl':  '#F8F4EC',  // Moon
        'chandra-blue':   '#B8D4E3',
        'mangal-red':     '#8B0000',  // Mars
        'budh-emerald':   '#50C878',  // Mercury
        'guru-yellow':    '#FADA5E',  // Jupiter
        'shukra-blush':   '#FFB6C1',  // Venus
        'shukra-rose':    '#B76E79',
        'shani-indigo':   '#191970',  // Saturn
        'rahu-violet':    '#9400D3',  // Rahu
        'ketu-maroon':    '#800000',  // Ketu
      },
      fontFamily: {
        // Loaded via next/font/google
        heading: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        accent:  ['var(--font-playfair-display)', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem',  { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem',    { lineHeight: '1.15' }],
        'heading-xl': ['2.25rem', { lineHeight: '1.2' }],
        'heading-lg': ['1.875rem',{ lineHeight: '1.25' }],
        'heading-md': ['1.5rem',  { lineHeight: '1.3' }],
        'heading-sm': ['1.25rem', { lineHeight: '1.4' }],
      },
      animation: {
        'orbit-slow':   'orbit 60s linear infinite',
        'orbit-med':    'orbit 40s linear infinite',
        'orbit-fast':   'orbit 20s linear infinite',
        'spin-slow':    'spin 30s linear infinite',
        'pulse-glow':   'pulseGlow 3s ease-in-out infinite',
        'fade-in':      'fadeIn 0.4s ease-in-out',
        'slide-up':     'slideUp 0.5s ease-out',
        'shimmer':      'shimmer 2s linear infinite',
      },
      keyframes: {
        orbit: {
          '0%':   { transform: 'rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201, 168, 76, 0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(201, 168, 76, 0.7)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backgroundImage: {
        'cosmic-gradient':   'linear-gradient(135deg, #0A0A0F 0%, #1B1640 50%, #0A0A0F 100%)',
        'gold-gradient':     'linear-gradient(135deg, #C9A84C 0%, #FADA5E 50%, #C9A84C 100%)',
        'shimmer-gradient':  'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.15) 50%, transparent 100%)',
      },
      boxShadow: {
        'gold-glow':   '0 0 30px rgba(201, 168, 76, 0.4)',
        'gold-subtle': '0 0 15px rgba(201, 168, 76, 0.2)',
        'cosmic':      '0 25px 50px rgba(0, 0, 0, 0.8)',
      },
      screens: {
        'xs': '360px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      transitionTimingFunction: {
        'cosmic': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),        // Blog rich-text prose styles
    require('@tailwindcss/forms'),             // Form element base styles
    require('@tailwindcss/aspect-ratio'),      // Product image aspect ratios
    require('@tailwindcss/container-queries'), // Responsive card components
  ],
}

export default config
