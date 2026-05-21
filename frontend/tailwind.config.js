/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans:    ['"DM Sans"', 'sans-serif'],
        serif:   ['"Instrument Serif"', 'Georgia', 'serif'],
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
        paper: {
          DEFAULT: '#f5f0e6',
          soft:    '#ebe4d2',
          mid:     '#e2d9c2',
          deep:    '#d8cdb1',
        },
        ink: {
          DEFAULT: '#111110',
          soft:    '#2a2a28',
          muted:   '#6e6a5d',
          rule:    '#d8d2c2',
        },
        clay: {
          DEFAULT: '#c2410c',
          light:   '#ea580c',
          deep:    '#9a3412',
        },
        moss: {
          DEFAULT: '#1f3a2c',
          light:   '#2f5a44',
        },
      },
      animation: {
        'fade-in':  'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.35s ease-out both',
        'rise':     'rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'marquee':  'marquee 38s linear infinite',
        'subtle-pulse': 'subtlePulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },                                to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        rise:    { from: { opacity: '0', transform: 'translateY(28px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        marquee: { from: { transform: 'translateX(0)' },                   to: { transform: 'translateX(-50%)' } },
        subtlePulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%':      { transform: 'scale(1.04)', opacity: '0.85' },
        },
      },
      letterSpacing: {
        tightest: '-0.05em',
        crunch:   '-0.07em',
      },
    },
  },
  plugins: [],
}
