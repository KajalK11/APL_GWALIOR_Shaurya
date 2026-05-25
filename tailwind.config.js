/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        sportsDark: '#020617', // Very deep slate/black
        sportsGreen: '#00FF87', // Radiant neon green (vitality/sports accent)
        sportsBlue: '#00E5FF',  // Electric cyan/blue (AI/tactical accent)
        sportsYellow: '#FFDE43', // Secondary warm accent
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      boxShadow: {
        'glow-green': '0 0 15px rgba(0, 255, 135, 0.2)',
        'glow-blue': '0 0 15px rgba(0, 229, 255, 0.2)',
        'neon-border-green': 'inset 0 0 4px rgba(0, 255, 135, 0.3)',
        'neon-border-blue': 'inset 0 0 4px rgba(0, 229, 255, 0.3)',
      }
    },
  },
  plugins: [],
}
