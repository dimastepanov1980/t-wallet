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
          DEFAULT: '#2563eb',
        },
        secondary: {
          DEFAULT: '#4f46e5',
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
