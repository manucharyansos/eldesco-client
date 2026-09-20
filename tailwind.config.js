/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2rem' },
      screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1200px', '2xl': '1280px' },
    },
    extend: {
      colors: {
        // Brand palette taken from the ELDESCO presentation: logo navy, footer rust, stripe amber.
        navy: {
          50: '#F1F4F9', 100: '#E2E8F1', 200: '#C3CEDF', 300: '#94A6C2', 400: '#5F7699',
          500: '#3A5478', 600: '#24406A', 700: '#153259', 800: '#0B2545', 900: '#071A33', 950: '#04101F',
        },
        rust: {
          50: '#FDF3EE', 100: '#FADFD1', 200: '#F3BDA1', 400: '#DC8459',
          500: '#BD582C', 600: '#A34A23', 700: '#83391B',
        },
        amber: { 400: '#F0A23F', 500: '#E48312', 600: '#C46E0B' },
        steel: {
          50: '#F4F6F9', 100: '#EAEEF3', 200: '#D8DEE6', 300: '#B9C2CE', 400: '#8894A4',
          500: '#647082', 600: '#4A5565', 700: '#343D4B', 800: '#222A36', 900: '#141A23',
        },
        // legacy tokens still referenced by the admin panel
        primary: { 50: '#f8f9fa', 100: '#e8ecf1', 500: '#2c3e50', 600: '#1f2937', 700: '#1a1f3a', 900: '#0f1419' },
        accent: { 400: '#f59e0b', 500: '#e67e22', 600: '#d97706' },
      },
      fontFamily: {
        // Manrope covers Latin + Cyrillic; Armenian glyphs fall through to Noto Sans Armenian.
        sans: ['"Manrope Variable"', '"Noto Sans Armenian Variable"', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      maxWidth: { '8xl': '90rem' },
    },
  },
  plugins: [],
};
