/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        peach: '#fcefe9',
        oxiOrange: '#f97316',
        oxiOrangeDark: '#ea580c',
      },
      boxShadow: {
        sensor: '0 8px 24px rgba(0,0,0,0.12), inset 0 2px 8px rgba(0,0,0,0.15)',
      },
      keyframes: {
        'finger-insert': {
          '0%, 100%': { transform: 'translateY(-6px)' },
          '50%': { transform: 'translateY(10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 0.7, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.03)' },
        },
      },
      animation: {
        finger: 'finger-insert 2.2s ease-in-out infinite',
        pulse: 'pulse-soft 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
