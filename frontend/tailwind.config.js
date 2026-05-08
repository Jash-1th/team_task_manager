/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
        },
        status: {
          todo: '#94a3b8',
          doing: '#3b82f6',
          done: '#22c55e',
        }
      }
    },
  },
  plugins: [],
}
