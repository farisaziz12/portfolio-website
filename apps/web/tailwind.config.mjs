/** @type {import('tailwindcss').Config} */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    fontFamily: {
      sans: ['Figtree Variable', 'Figtree', 'system-ui', '-apple-system', 'sans-serif'],
      display: ['Figtree Variable', 'Figtree', 'system-ui', 'sans-serif'],
      mono: ['ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
    },
    extend: {
      colors: {
        // Background / surfaces
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--surface-1) / <alpha-value>)',
          1: 'rgb(var(--surface-1) / <alpha-value>)',
          2: 'rgb(var(--surface-2) / <alpha-value>)',
          3: 'rgb(var(--surface-3) / <alpha-value>)',
          // Back-compat aliases for code still referring to old names
          raised: 'rgb(var(--surface-2) / <alpha-value>)',
          overlay: 'rgb(var(--surface-3) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          muted: 'rgb(var(--ink-muted) / <alpha-value>)',
          faint: 'rgb(var(--ink-faint) / <alpha-value>)',
          'on-accent': 'rgb(var(--ink-on-accent) / <alpha-value>)',
          'on-signal': 'rgb(var(--ink-on-signal) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          bright: 'rgb(var(--accent-bright) / <alpha-value>)',
          deep: 'rgb(var(--accent-deep) / <alpha-value>)',
          press: 'rgb(var(--accent-press) / <alpha-value>)',
          // Back-compat
          hover: 'rgb(var(--accent-press) / <alpha-value>)',
          muted: 'rgb(var(--accent-bright) / 0.1)',
        },
        signal: {
          DEFAULT: 'rgb(var(--signal) / <alpha-value>)',
          deep: 'rgb(var(--signal-deep) / <alpha-value>)',
        },
        edge: {
          DEFAULT: 'rgb(var(--edge) / <alpha-value>)',
          strong: 'rgb(var(--edge-strong) / <alpha-value>)',
        },
        danger: 'rgb(var(--danger) / <alpha-value>)',
        // Back-compat success token (used by some pages)
        success: {
          DEFAULT: 'rgb(var(--signal) / <alpha-value>)',
          muted: 'rgb(var(--signal) / 0.1)',
        },
      },
      fontSize: {
        'display-xl': ['5rem', { lineHeight: '0.98', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-lg': ['3.6rem', { lineHeight: '1.02', letterSpacing: '-0.022em', fontWeight: '700' }],
        'display': ['2.5rem', { lineHeight: '1.08', letterSpacing: '-0.018em', fontWeight: '700' }],
        'display-sm': ['2rem', { lineHeight: '1.12', letterSpacing: '-0.015em', fontWeight: '600' }],
        'body-xl': ['1.25rem', { lineHeight: '1.6' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.65' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'body-xs': ['0.75rem', { lineHeight: '1.4' }],
        'label': ['0.8125rem', { lineHeight: '1', letterSpacing: '0.06em', fontWeight: '500' }],
        'label-sm': ['0.6875rem', { lineHeight: '1', letterSpacing: '0.12em', fontWeight: '500' }],
        'kicker': ['0.72rem', { lineHeight: '1', letterSpacing: '0.16em', fontWeight: '500' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        'content': '680px',
        'narrow': '680px',
        'wide': '920px',
        'container': '1140px',
      },
      borderRadius: {
        // DS v3: 4px buttons/inputs, 6px cards/images. Nothing larger.
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '6px',
        'lg': '6px',
        'xl': '6px',
        '2xl': '6px',
      },
      boxShadow: {
        // DS v3: no shadows. Separation is a hairline or a change of ground.
        'soft': 'none',
        'lifted': 'none',
        'tall': 'none',
        'accent': 'none',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'dot-pulse': 'dotPulse 2.2s cubic-bezier(0.16, 1, 0.3, 1) infinite',
        'blink': 'blink 1.1s steps(1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        dotPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(31,207,166,0.10)' },
          '50%': { boxShadow: '0 0 0 5px transparent' },
        },
        blink: {
          '50%': { opacity: '0' },
        },
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'rgb(var(--ink-muted))',
            '--tw-prose-headings': 'rgb(var(--ink))',
            '--tw-prose-links': 'rgb(var(--text))',
            '--tw-prose-bold': 'rgb(var(--ink))',
            '--tw-prose-quotes': 'rgb(var(--ink-muted))',
            '--tw-prose-code': 'rgb(var(--ink))',
            maxWidth: 'none',
            a: {
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              textDecorationColor: 'rgb(var(--yellow))',
              '&:hover': {
                textDecorationColor: 'rgb(var(--accent))',
              },
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
