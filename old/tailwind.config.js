/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./features/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#030303',
        surface: '#0A0A0A',
        surfaceHighlight: '#121212',
        border: '#1F1F1F',
        primary: {
          DEFAULT: '#00D1FF', // Cyan/Electric Blue
          50: '#E0F9FF',
          100: '#B3F0FF',
          200: '#80E6FF',
          300: '#4DDBFF',
          400: '#1AD1FF',
          500: '#00D1FF',
          600: '#00A8CC',
          700: '#007F99',
          800: '#005666',
          900: '#002D33',
        },
        accent: {
          DEFAULT: '#FF3D00', // Orange/Red for contrast
          50: '#FFEBCC',
          100: '#FFD699',
          200: '#FFC266',
          300: '#FFAD33',
          400: '#FF9900',
          500: '#FF3D00', // Orange
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Orbitron', 'sans-serif'], // Futuristic header font?
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #1f1f1f 1px, transparent 1px), linear-gradient(to bottom, #1f1f1f 1px, transparent 1px)",
        'glow-gradient': "radial-gradient(circle at center, rgba(0, 209, 255, 0.1) 0%, transparent 70%)",
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    require('tailwindcss-animate'),
  ],
}
