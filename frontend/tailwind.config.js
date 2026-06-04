/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'DM Sans',
  				'ui-sans-serif',
  				'system-ui',
  				'sans-serif'
  			],
  			display: [
  				'Fraunces',
  				'Georgia',
  				'serif'
  			]
  		},
  		colors: {
  			// ── Custom design tokens ───────────────────────────────
  			bg: {
  				base:    'hsl(var(--bg-base))',
  				surface: 'hsl(var(--bg-surface))',
  				subtle:  'hsl(var(--bg-subtle))'
  			},
  			border: 'hsl(var(--border))',
  			text: {
  				primary:   'hsl(var(--text-primary))',
  				secondary: 'hsl(var(--text-secondary))',
  				muted:     'hsl(var(--text-muted))'
  			},
  			accent: {
  				DEFAULT:    'hsl(var(--accent))',
  				foreground: 'hsl(0 0% 100%)',
  				light:      'hsl(var(--accent-light))',
  				hover:      'hsl(var(--accent-hover))'
  			},
  			warning: 'hsl(var(--warning))',
  			danger:  'hsl(var(--danger))',
  			info:    'hsl(var(--info))',
  			// ── shadcn/ui compatibility aliases ────────────────────
  			background: 'hsl(var(--bg-base))',
  			foreground: 'hsl(var(--text-primary))',
  			card: {
  				DEFAULT:    'hsl(var(--bg-surface))',
  				foreground: 'hsl(var(--text-primary))'
  			},
  			popover: {
  				DEFAULT:    'hsl(var(--bg-surface))',
  				foreground: 'hsl(var(--text-primary))'
  			},
  			primary: {
  				DEFAULT:    'hsl(var(--accent))',
  				foreground: 'hsl(0 0% 100%)'
  			},
  			secondary: {
  				DEFAULT:    'hsl(var(--bg-subtle))',
  				foreground: 'hsl(var(--text-primary))'
  			},
  			muted: {
  				DEFAULT:    'hsl(var(--bg-subtle))',
  				foreground: 'hsl(var(--text-muted))'
  			},
  			destructive: {
  				DEFAULT:    'hsl(var(--danger))',
  				foreground: 'hsl(0 0% 100%)'
  			},
  			input:  'hsl(var(--border))',
  			ring:   'hsl(var(--accent))',
  			// ── Status colors ──────────────────────────────────────
  			st: {
  				applied:   'hsl(var(--info))',
  				interview: 'hsl(var(--warning))',
  				offer:     'hsl(var(--accent))',
  				rejected:  'hsl(var(--text-muted))',
  				ghosted:   'hsl(var(--text-muted))',
  				withdrawn: 'hsl(var(--text-muted))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		animation: {
  			'fade-in-up': 'fadeInUp .8s cubic-bezier(.2,.7,.2,1) both',
  			'fade-in': 'fadeIn .35s ease both',
  			'float-y': 'floatY 7s ease-in-out infinite',
  			marquee: 'marquee 40s linear infinite',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		keyframes: {
  			fadeInUp: {
  				from: {
  					opacity: '0',
  					transform: 'translate3d(0, 16px, 0)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translate3d(0, 0, 0)'
  				}
  			},
  			fadeIn: {
  				from: {
  					opacity: '0'
  				},
  				to: {
  					opacity: '1'
  				}
  			},
  			floatY: {
  				'0%, 100%': {
  					transform: 'translate3d(0, 0, 0)'
  				},
  				'50%': {
  					transform: 'translate3d(0, -8px, 0)'
  				}
  			},
  			marquee: {
  				from: {
  					transform: 'translate3d(0,0,0)'
  				},
  				to: {
  					transform: 'translate3d(-50%,0,0)'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		}
  	}
  },
  plugins: [require('tailwindcss-animate')],
}
