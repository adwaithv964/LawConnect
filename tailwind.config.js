module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)', /* blue-900 */
          foreground: 'var(--color-primary-foreground)' /* white */
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', /* teal-700 */
          foreground: 'var(--color-secondary-foreground)' /* white */
        },
        accent: {
          DEFAULT: 'var(--color-accent)', /* red-600 */
          foreground: 'var(--color-accent-foreground)' /* white */
        },
        background: 'var(--color-background)', /* gray-50 */
        foreground: 'var(--color-foreground)', /* gray-800 */
        card: {
          DEFAULT: 'var(--color-card)', /* white */
          foreground: 'var(--color-card-foreground)' /* gray-800 */
        },
        popover: {
          DEFAULT: 'var(--color-popover)', /* white */
          foreground: 'var(--color-popover-foreground)' /* gray-800 */
        },
        muted: {
          DEFAULT: 'var(--color-muted)', /* gray-100 */
          foreground: 'var(--color-muted-foreground)' /* gray-500 */
        },
        border: 'var(--color-border)', /* slate-200 */
        input: 'var(--color-input)', /* slate-200 */
        ring: 'var(--color-ring)', /* blue-900 */
        success: {
          DEFAULT: 'var(--color-success)', /* emerald-600 */
          foreground: 'var(--color-success-foreground)' /* white */
        },
        warning: {
          DEFAULT: 'var(--color-warning)', /* amber-600 */
          foreground: 'var(--color-warning-foreground)' /* white */
        },
        error: {
          DEFAULT: 'var(--color-error)', /* red-600 */
          foreground: 'var(--color-error-foreground)' /* white */
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', /* red-600 */
          foreground: 'var(--color-destructive-foreground)' /* white */
        }
      },
      fontFamily: {
        heading: ['Lexend', 'sans-serif'],
        body: ['Source Sans 3', 'sans-serif'],
        caption: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      fontSize: {
        'h1': ['2.25rem', { lineHeight: '1.2', fontWeight: '600' }],
        'h2': ['1.875rem', { lineHeight: '1.25', fontWeight: '600' }],
        'h3': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
        'h5': ['1.125rem', { lineHeight: '1.5', fontWeight: '500' }],
        'caption': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.025em' }]
      },
      borderRadius: {
        'sm': '6px',
        'DEFAULT': '12px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px'
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      boxShadow: {
        'elevation-0': 'none',
        'elevation-1': '0 1px 3px rgba(15, 23, 42, 0.08)',
        'elevation-2': '0 2px 6px rgba(15, 23, 42, 0.1)',
        'elevation-3': '0 6px 12px rgba(15, 23, 42, 0.12)',
        'elevation-4': '0 12px 24px rgba(15, 23, 42, 0.14)',
        'elevation-5': '0 20px 25px -5px rgba(15, 23, 42, 0.16)'
      },
      transitionDuration: {
        'smooth': '250ms'
      },
      transitionTimingFunction: {
        'smooth': 'ease-out',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      },
      scale: {
        '97': '0.97'
      },
      zIndex: {
        '100': '100',
        '200': '200',
        '300': '300',
        '400': '400'
      },
      ringWidth: {
        '3': '3px'
      },
      ringOffsetWidth: {
        '2': '2px'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate')
  ]
}