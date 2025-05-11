// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    // make sure these globs point at your src + wherever your HTML lives
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // override “blue” so even if something uses “blue-500” it’s gray
        blue: {
          50:  '#f9f9f9',
          100: '#f0f0f0',
          200: '#dcdcdc',
          300: '#bfbfbf',
          400: '#999999',
          500: '#737373',
          600: '#595959',
          700: '#404040',
          800: '#2e2e2e',
          900: '#1c1c1c',
        },
        // you can also add “primary” or “accent” colors if you use them:
        primary: {
          DEFAULT: '#e5e5e5', // almost-white
          dark:    '#b3b3b3',
        }
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out both'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    // if you need custom forms styles
    require('@tailwindcss/forms'),
  ],
}