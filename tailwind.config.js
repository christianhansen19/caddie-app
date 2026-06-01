/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        fairway: {
          50: '#f1f8f3',
          100: '#dcecdf',
          200: '#bbd9c1',
          300: '#8fbf98',
          400: '#5ea36b',
          500: '#1f7a3a',
          600: '#196431',
          700: '#155028',
          800: '#0f5132',
          900: '#0a3a23',
        },
        sand: {
          50: '#fbf6e8',
          100: '#f4e9c4',
          200: '#e8d290',
          300: '#dbb85e',
          400: '#c69a3f',
        },
        cream: '#f8f5ec',
      },
      fontFamily: {
        display: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 6px 24px -8px rgba(15, 81, 50, 0.18)',
      },
    },
  },
  plugins: [],
};
