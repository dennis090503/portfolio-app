/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', 
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Utilizing opacity-safe tailwind CSS variables mapping
        background: 'rgb(var(--background) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        text: {
          DEFAULT: 'rgb(var(--text-default) / <alpha-value>)',
          muted: 'rgb(var(--text-muted) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px rgba(10,10,10,0.06)',
        card: '0 8px 40px rgba(10,10,10,0.08)',
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
    },
  },
  plugins: [],
};