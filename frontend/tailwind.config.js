// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#0F172A', light: '#1E293B', soft: '#334155' },
        accent: { DEFAULT: '#2563EB', light: '#DBEAFE' },
        ayush: { DEFAULT: '#C2703D', light: '#FBEAE0' },
        success: { DEFAULT: '#16A34A', light: '#DCFCE7' },
        warning: { DEFAULT: '#F59E0B', light: '#FEF3C7' },
        danger: { DEFAULT: '#DC2626', light: '#FEE2E2' },
        surface: '#F8FAFC',
      },
      screens: { xs: '480px' },
      boxShadow: { card: '0 1px 2px 0 rgba(15,23,42,0.06), 0 1px 3px 0 rgba(15,23,42,0.08)' },
      borderRadius: { xl2: '1.25rem' },
    },
  },
  plugins: [],
};