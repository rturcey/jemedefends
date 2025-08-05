/** @type {import('tailwindcss').Config} */
module.exports = {
  safelist: [
    { pattern: /(bg|text|border)-(blue|purple|green|indigo|orange|pink|yellow|gray)-(50|100|200|600|700)/ },
  ],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'slide-in': 'slideIn 400ms ease-out',
        'grow-bar': 'growBar 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
  ,plugins: [require("tailwindcss-animate")]
          '100%': { opacity: '1' }
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        growBar: {
          from: { width: 'var(--from, 0%)' },
          to: { width: 'var(--to, 0%)' }
        }
      },
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        success: {
          50: '#f0fdf4',
          500: '#10b981',
          600: '#059669',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'step': '0 4px 12px rgba(59, 130, 246, 0.4)',
        'success': '0 4px 12px rgba(16, 185, 129, 0.4)',
      }
    },
  },
  plugins: [
    // Plugin pour les utilitaires de focus
    function({ addUtilities }) {
      addUtilities({
        '.focus-visible': {
          '&:focus': {
            outline: '2px solid #3b82f6',
            'outline-offset': '2px',
          }
        }
      })
    }
  ],
}
