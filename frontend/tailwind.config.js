/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // AJOUT : Breakpoint xs pour très petits mobiles
      screens: {
        xs: '480px',
        // sm: '640px', (défaut Tailwind)
        // md: '768px', (défaut Tailwind)
        // lg: '1024px', (défaut Tailwind)
        // xl: '1280px', (défaut Tailwind)
        // 2xl: '1536px', (défaut Tailwind)
      },

      // Couleurs cohérentes pour les sections
      colors: {
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB', // Bleu principal
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        surface: {
          soft: '#F8FAFC', // Fond gris très clair pour alternance
        },
        animation: {
          shimmer: 'shimmer 2s linear infinite',
        },
        keyframes: {
          shimmer: {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(100%)' },
          },
        },
      },

      // Espacements cohérents mobile-first
      spacing: {
        18: '4.5rem', // 72px
        22: '5.5rem', // 88px
        26: '6.5rem', // 104px
        30: '7.5rem', // 120px
      },

      // Touch targets optimaux
      minHeight: {
        touch: '44px', // Minimum WCAG
        'touch-lg': '56px', // Recommandé
      },

      minWidth: {
        touch: '44px',
        'touch-lg': '56px',
      },

      // Typography mobile-first
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }], // 10px
        xs: ['0.75rem', { lineHeight: '1rem' }], // 12px
        sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        base: ['1rem', { lineHeight: '1.5rem' }], // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        xl: ['1.25rem', { lineHeight: '1.75rem' }], // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
        '5xl': ['3rem', { lineHeight: '1' }], // 48px
        '6xl': ['3.75rem', { lineHeight: '1' }], // 60px
      },

      // Animations optimisées mobile
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in-from-top': 'slideInFromTop 0.3s ease-out',
        'slide-in-from-bottom': 'slideInFromBottom 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInFromTop: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInFromBottom: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },

      // Shadows cohérentes
      boxShadow: {
        'sm-mobile': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        mobile: '0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'md-mobile': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'lg-mobile': '0 6px 12px -2px rgb(0 0 0 / 0.1)',
      },

      // Border radius cohérents
      borderRadius: {
        mobile: '0.75rem', // 12px pour cards mobiles
        'mobile-lg': '1rem', // 16px pour sections mobiles
      },
    },
  },
  plugins: [
    // Plugin pour les animations conditionnelles selon prefers-reduced-motion
    function ({ addUtilities }) {
      const newUtilities = {
        '.animate-safe': {
          '@media (prefers-reduced-motion: reduce)': {
            'animation-duration': '0.01ms',
            'animation-iteration-count': '1',
            'transition-duration': '0.01ms',
          },
        },
      };
      addUtilities(newUtilities);
    },

    // Plugin pour les touch-targets
    function ({ addComponents }) {
      const touchTargets = {
        '.touch-target': {
          'min-height': '44px',
          'min-width': '44px',
        },
        '.touch-target-lg': {
          'min-height': '56px',
          'min-width': '56px',
        },
      };
      addComponents(touchTargets);
    },
  ],
};
