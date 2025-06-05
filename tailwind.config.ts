import type { Config } from 'tailwindcss';

const config: Config = {
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
          DEFAULT: '#ebcd25',
        },
        background: {
          DEFAULT: '#f8fafc',
        },
        foreground: {
          DEFAULT: '#0f172a',
        },
      },
    },
  },
  plugins: [],
};

export default config;
