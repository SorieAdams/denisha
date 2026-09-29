
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#050505',
        'midnight-soft': '#0a0909',
        'midnight-mid': '#110f0f',
        cream: '#f5f0e8',
        'cream-dim': '#c9b8a8',
        // primary accent: warm crimson / burgundy
        crimson: '#9b2335',
        'crimson-dim': '#6b1825',
        'crimson-light': '#c43050',
        // secondary: muted gold (used sparingly)
        gold: '#c9a84c',
        'gold-dim': '#8a6f30',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1.2s ease forwards',
        'fade-up': 'fadeUp 1s ease forwards',
        'sparkle': 'sparkle 3s ease-in-out infinite',
        'twinkle': 'twinkle 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0.5)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0' },
          '30%': { opacity: '0.8' },
          '70%': { opacity: '0.3' },
        },
      },
    },
  },
  plugins: [],
}

export default config
