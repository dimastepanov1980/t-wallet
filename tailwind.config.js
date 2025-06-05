/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ebcd25',
        },
        secondary: {
          DEFAULT: '#4f46e5',
        },
        background: {
          DEFAULT: '#f9fafb',
        },
        foreground: {
          DEFAULT: '#0f172a',
        },
      },
    },
  },
  plugins: [],
} 