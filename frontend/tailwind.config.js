/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans:    ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#080816',
          900: '#0f0f23',
          800: '#1a1a35',
          700: '#252547',
        },
        accent: {
          DEFAULT: '#7c3aed',
          light:   '#8b5cf6',
          dark:    '#6d28d9',
          subtle:  '#f3f0ff',
        },
      },
      animation: {
        'fade-in':  'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.35s ease-out both',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },                                to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
