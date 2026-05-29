/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        crimson: {
          DEFAULT: '#8B1A1A',
          soft: '#A52A2A',
          light: '#C0392B',
          glow: 'rgba(139,26,26,0.35)',
          subtle: 'rgba(139,26,26,0.12)',
        },
        gold: {
          DEFAULT: '#C9A96E',
          light: '#E8C88A',
        },
        obsidian: '#080808',
        dark: {
          DEFAULT: '#111111',
          2: '#181818',
          3: '#222222',
          4: '#2a2a2a',
        },
        smoke: '#3a3a3a',
        mist: '#888888',
        pearl: '#c8c8c8',
        snow: '#f0ede8',
      },
      fontFamily: {
        cormorant: ['Cormorant Garamond', 'Georgia', 'serif'],
        cinzel: ['Cinzel', 'serif'],
        garamond: ['EB Garamond', 'Georgia', 'serif'],
      },
      animation: {
        'pulse-orb': 'pulseOrb 6s ease-in-out infinite',
        'fade-up': 'fadeUp 1.2s ease forwards',
        'rotate-slow': 'rotateSlow 30s linear infinite',
      },
      keyframes: {
        pulseOrb: {
          '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '0.8' },
          '50%': { transform: 'translate(-50%, -50%) scale(1.1)', opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        rotateSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
