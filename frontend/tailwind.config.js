/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        'bg-surface': 'var(--color-bg-surface)',
        text: 'var(--color-text)',
        'text-sub': 'var(--color-sub)',
        main: 'var(--color-main)',
        error: 'var(--color-error)',
        'error-sub': 'var(--color-error-sub)',
        correct: 'var(--color-correct)',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'caret-blink': 'blink 1s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
