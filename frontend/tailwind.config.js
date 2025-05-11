/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      // === 1. NEW PALETTE ===
      colors: {
        background: {
          DEFAULT: '#0A0F1B', // your new page background
          dark:    '#0A0F1B',
        },
        card: '#121826',       // surfaces (cards, panels)
        border: '#1E2333',     // hr / divider lines
        'text-base':  '#D1D5DB', // primary copy
        'text-light': '#F0F2F5', // accents / headings
      },

      // === 2. EXISTING ANIMATIONS ===
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out both'
      }
    }
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}