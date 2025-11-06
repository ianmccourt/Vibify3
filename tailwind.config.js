/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'room-warm': '#F5E6D3',
        'room-cool': '#E8F4F8',
        'room-neon': '#1A1A2E',
        'accent-neon-pink': '#FF006E',
        'accent-neon-cyan': '#00F5FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
