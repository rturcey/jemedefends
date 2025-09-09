/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    {
      pattern:
        /(bg|text|border)-(blue|purple|green|indigo|orange|pink|yellow|gray)-(50|100|200|600|700)/,
    },
  ],
  theme: {
    extend: {
      colors: { brand: { 600: #2563EB, 700: #1D4ED8 }, surface: { soft: #F8FAFC } },
      colors: {
        // Palette mobile-optimisée avec contraste AAA
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Primary CTA
          700: '#1d4ed8', // Hover state
          800: '#1e40af',
          900: '#1e3a8a',
        },
        success: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Échelle mobile-first
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
      },
      spacing: {
        // Touch-friendly spacing
        18: '4.5rem',
        88: '22rem',
      },
      minHeight: {
        touch: '44px', // iOS minimum
        button: '52px', // CTA optimisé
      },
      animation: {
        in: 'fadeIn 0.2s ease-out',
        'slide-in-from-top-1': 'slideInFromTop 0.2s ease-out',
        'bounce-in': 'bounceIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInFromTop: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        touch: '0 2px 8px -2px rgba(0, 0, 0, 0.1)',
        button: '0 4px 12px -2px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
