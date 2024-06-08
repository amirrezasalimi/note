/** @type {import('tailwindcss').Config} */
import TypographyPlugin from '@tailwindcss/typography'
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          button: '#e5e7eb',
          background: '#f0f0f0',
          text: '#000',
        },
        dark: {
          button: '#4b5563',
          background: '#1f2937',
          text: '#fff',
        },
      }
    },
  },
  plugins: [
    TypographyPlugin,
  ],
}