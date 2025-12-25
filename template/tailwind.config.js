/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'can-green': '#047857', // Emerald 700
        'can-green-dark': '#064e3b', // Emerald 900
        'can-gold': '#fbbf24', // Amber 400
        'can-gold-light': '#fcd34d', // Amber 300
        'can-copper': '#b45309', // Amber 700
      },
      animation: {
        'blob': 'blob 7s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
