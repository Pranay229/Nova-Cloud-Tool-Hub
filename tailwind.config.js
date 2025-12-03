/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Customize colors here
      colors: {
        // Primary brand colors (currently blue/indigo)
        // Change these to customize your theme
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',  // Main primary color
          600: '#2563eb',  // Used in buttons and accents
          700: '#1d4ed8',
        },
        secondary: {
          500: '#6366f1',  // Indigo
          600: '#4f46e5',
        },
      },
      // Customize fonts
      fontFamily: {
        sans: ['PT Serif', 'serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        script: ['Kaushan Script', 'cursive'],
        serif: ['PT Serif', 'serif'],
      },
      // Customize spacing, border radius, etc.
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
