/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: 'var(--color-accent)',
          soft: 'var(--color-accent-soft)',
          textLight: 'var(--color-accent-text-light)',
          textDark: 'var(--color-accent-text-dark)'
        }
      },
      fontFamily: {
        'serif-eng': ['var(--font-serif-eng)', 'serif'],
        'serif-cn': ['"Songti SC"', '"Noto Serif TC"', '"SimSun"', 'serif'],
      },
      transitionTimingFunction: {
        snappy: 'cubic-bezier(0.32, 0.72, 0, 1)'
      },
      transitionDuration: {
        180: '180ms',
        260: '260ms'
      },
      boxShadow: {
        lifted: '0 12px 30px -14px rgba(15, 23, 42, 0.25)',
        outline: '0 0 0 1px rgba(59, 130, 246, 0.25)'
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
        },
        'float-soft': {
          '0%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(4px,-6px,0) scale(1.03)' },
          '100%': { transform: 'translate3d(0,0,0) scale(1)' }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out both',
        'float-soft': 'float-soft 12s ease-in-out infinite'
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.slate.700'),
            a: {
              color: 'var(--color-accent-text-light)',
              '&:hover': {
                color: 'var(--color-accent)'
              }
            },
            h1: {
              fontWeight: '700',
              letterSpacing: '-0.03em',
              fontFamily: 'var(--font-serif-eng), "Songti SC", serif',
            },
            h2: {
              fontWeight: '600',
              letterSpacing: '-0.02em',
              fontFamily: 'var(--font-serif-eng), "Songti SC", serif',
            },
            blockquote: {
              fontStyle: 'normal',
              borderLeftColor: 'var(--color-accent-soft)',
              color: theme('colors.slate.700'),
              backgroundColor: theme('colors.slate.50')
            },
            code: {
              backgroundColor: theme('colors.slate.100'),
              padding: '0.15rem 0.35rem',
              borderRadius: '0.25rem'
            }
          }
        },
        dark: {
          css: {
            // Slightly softer than pure white for body text
            color: theme('colors.slate.200'),
            a: {
              color: 'var(--color-accent-text-dark)',
              '&:hover': {
                color: 'var(--color-accent)'
              }
            },
            strong: {
              color: theme('colors.slate.50'),
              fontWeight: '700'
            },
            b: {
              color: theme('colors.slate.50'),
              fontWeight: '700'
            },
            em: {
              color: theme('colors.slate.100')
            },
            h1: {
              color: theme('colors.slate.50')
            },
            h2: {
              color: theme('colors.slate.50')
            },
            blockquote: {
              borderLeftColor: 'var(--color-accent)',
              backgroundColor: theme('colors.slate.800'),
              color: theme('colors.slate.200'),
              p: {
                color: theme('colors.slate.200')
              }
            },
            code: {
              backgroundColor: theme('colors.slate.800')
            }
          }
        }
      })
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
