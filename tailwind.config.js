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
              letterSpacing: '-0.03em'
            },
            h2: {
              fontWeight: '600',
              letterSpacing: '-0.02em'
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
