/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f9fa',
          100: '#e8ecf1',
          500: '#2c3e50',
          600: '#1f2937',
          700: '#1a1f3a',
          900: '#0f1419'
        },
        accent: {
          400: '#f59e0b',
          500: '#e67e22',
          600: '#d97706'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        display: ['Georgia', 'serif']
      },
      spacing: {
        '128': '32rem',
        '144': '36rem'
      },
      maxWidth: {
        '8xl': '90rem'
      }
    },
  },
  plugins: [],
};
