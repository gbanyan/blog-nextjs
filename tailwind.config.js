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
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.slate.700'),
            a: {
              color: theme('colors.blue.600'),
              '&:hover': {
                color: theme('colors.blue.700')
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
              borderLeftColor: theme('colors.blue.200'),
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
              color: theme('colors.blue.400'),
              '&:hover': {
                color: theme('colors.blue.300')
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
              borderLeftColor: theme('colors.blue.500'),
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
