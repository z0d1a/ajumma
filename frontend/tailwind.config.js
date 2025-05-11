/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    // adjust these to wherever your index.html lives and your source
    './frontend/index.html',
    './frontend/src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // override all of “blue” so e.g. bg-blue-500 becomes a mid-dark gray
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
        // optional: define a “primary” you can use across both light & dark
        primary: {
          DEFAULT: '#e5e5e5', // almost-white
          dark:    '#b3b3b3',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out both',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
}