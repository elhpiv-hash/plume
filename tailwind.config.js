/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Colors are driven by CSS custom properties (RGB channels) so theme
      // switching is a single data-attribute flip and every opacity modifier
      // works. Defined under `extend` to keep Tailwind's defaults (black,
      // white, transparent, current). See src/styles/tokens.css.
      colors: {
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        elevated: 'rgb(var(--c-elevated) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        'surface-hover': 'rgb(var(--c-surface-hover) / <alpha-value>)',
        fg: 'rgb(var(--c-fg) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        faint: 'rgb(var(--c-faint) / <alpha-value>)',
        invert: 'rgb(var(--c-invert) / <alpha-value>)',
        'invert-fg': 'rgb(var(--c-invert-fg) / <alpha-value>)',
        'invert-hover': 'rgb(var(--c-invert-hover) / <alpha-value>)',
        signal: 'rgb(var(--c-signal) / <alpha-value>)',
        danger: 'rgb(var(--c-danger) / <alpha-value>)',
        // Hairline borders derive from the foreground channel and self-invert.
        border: 'rgb(var(--c-fg) / 0.08)',
        'border-strong': 'rgb(var(--c-fg) / 0.16)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Geist', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
        sm: ['0.8125rem', { lineHeight: '1.2rem' }],
        base: ['0.9375rem', { lineHeight: '1.5rem' }],
        lg: ['1.0625rem', { lineHeight: '1.6rem' }],
        xl: ['1.25rem', { lineHeight: '1.7rem', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '1.9rem', letterSpacing: '-0.02em' }],
        '3xl': ['2rem', { lineHeight: '2.25rem', letterSpacing: '-0.03em' }],
        display: ['2.75rem', { lineHeight: '2.85rem', letterSpacing: '-0.04em' }],
        hero: ['3.75rem', { lineHeight: '3.7rem', letterSpacing: '-0.045em' }],
      },
      borderRadius: {
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -12px var(--shadow-color)',
        lift: '0 4px 12px -4px var(--shadow-color), 0 16px 40px -16px var(--shadow-color)',
        signal: '0 0 0 1px var(--signal-soft), 0 0 28px -6px var(--signal-glow)',
        focus: '0 0 0 3px var(--ring)',
      },
      transitionTimingFunction: {
        plume: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'post-enter': {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.995)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'sheet-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'signal-pulse': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'post-enter': 'post-enter 0.45s var(--ease-plume) both',
        'fade-in': 'fade-in 0.3s ease-out both',
        'scale-in': 'scale-in 0.32s var(--ease-plume) both',
        'sheet-up': 'sheet-up 0.34s var(--ease-plume) both',
        'signal-pulse': 'signal-pulse 3.2s ease-in-out infinite',
        'toast-in': 'toast-in 0.3s var(--ease-plume) both',
      },
    },
  },
  plugins: [],
};
