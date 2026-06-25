/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Theme-aware colors using CSS variables
        background: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          tertiary: 'var(--color-bg-tertiary)',
        },
        surface: {
          primary: 'var(--color-surface-primary)',
          secondary: 'var(--color-surface-secondary)',
          elevated: 'var(--color-surface-elevated)',
        },
        border: {
          primary: 'var(--color-border-primary)',
          secondary: 'var(--color-border-secondary)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          muted: 'var(--color-text-muted)',
        },
        accent: {
          primary: 'var(--color-accent-primary)',
          hover: 'var(--color-accent-hover)',
          muted: 'var(--color-accent-muted)',
        },
        success: {
          bg: 'var(--color-success-bg)',
          text: 'var(--color-success-text)',
          border: 'var(--color-success-border)',
        },
        warning: {
          bg: 'var(--color-warning-bg)',
          text: 'var(--color-warning-text)',
          border: 'var(--color-warning-border)',
        },
        error: {
          bg: 'var(--color-error-bg)',
          text: 'var(--color-error-text)',
          border: 'var(--color-error-border)',
        },
      },
    },
  },
  plugins: [],
}
