/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono:    ['Geist Mono', 'ui-monospace', 'SF Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        serif:   ['Instrument Serif', 'Georgia', 'serif'],
        display: ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        paper:   { DEFAULT: 'var(--paper)', 2: 'var(--paper-2)', soft: 'var(--paper-2)', mid: 'var(--line)' },
        surface: { DEFAULT: 'var(--surface)' },
        ink: {
          DEFAULT: 'var(--ink)',
          2:       'var(--ink-2)',
          soft:    'var(--ink-2)',
          muted:   'var(--muted)',
          rule:    'var(--line)',
        },
        muted:   { DEFAULT: 'var(--muted)', 2: 'var(--muted-2)' },
        line:    { DEFAULT: 'var(--line)',  2: 'var(--line-2)' },
        accent:  { DEFAULT: 'var(--accent)', ink: 'var(--accent-ink)' },
        st: {
          applied:   'var(--st-applied)',
          interview: 'var(--st-interview)',
          offer:     'var(--st-offer)',
          rejected:  'var(--st-rejected)',
          ghosted:   'var(--st-ghosted)',
          withdrawn: 'var(--st-withdrawn)',
        },
        // Marketing palette (landing + auth pages)
        clay: {
          DEFAULT: '#c2410c',
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        moss: '#1f3a2c',
      },
      borderRadius: {
        sm:   '6px',
        md:   '10px',
        lg:   '14px',
        xl:   '22px',
        pill: '999px',
      },
      letterSpacing: {
        tightest: '-0.05em',
        crunch:   '-0.07em',
      },
      animation: {
        'fade-in-up':  'fadeInUp .8s cubic-bezier(.2,.7,.2,1) both',
        'fade-in':     'fadeIn .35s ease both',
        'float-y':     'floatY 7s ease-in-out infinite',
        'float-y-alt': 'floatYAlt 8s ease-in-out infinite',
        'marquee-fwd': 'marqueeFwd 60s linear infinite',
        'marquee-rev': 'marqueeRev 70s linear infinite',
        'dot-pulse':   'dotPulse 2.4s ease-in-out infinite',
        'page-enter':  'fadeIn .35s ease both',
        // Aliases used by marketing pages
        'rise':        'fadeInUp .7s cubic-bezier(.2,.7,.2,1) both',
        'marquee':     'marqueeFwd 40s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translate3d(0, 16px, 0)' },
          to:   { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        floatY: {
          '0%, 100%': { transform: 'var(--base-rot, none) translate3d(0, 0, 0)' },
          '50%':      { transform: 'var(--base-rot, none) translate3d(0, -8px, 0)' },
        },
        floatYAlt: {
          '0%, 100%': { transform: 'var(--base-rot, none) translate3d(0, -4px, 0)' },
          '50%':      { transform: 'var(--base-rot, none) translate3d(0, 6px, 0)' },
        },
        marqueeFwd: {
          from: { transform: 'translate3d(0,0,0)' },
          to:   { transform: 'translate3d(-50%,0,0)' },
        },
        marqueeRev: {
          from: { transform: 'translate3d(-50%,0,0)' },
          to:   { transform: 'translate3d(0,0,0)' },
        },
        dotPulse: {
          '0%, 100%': { 'box-shadow': '0 0 0 4px color-mix(in oklch, var(--accent) 25%, transparent)' },
          '50%':      { 'box-shadow': '0 0 0 8px color-mix(in oklch, var(--accent) 10%, transparent)' },
        },
      },
    },
  },
  plugins: [],
}
