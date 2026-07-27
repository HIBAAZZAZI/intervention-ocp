/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ocp: {
          50: '#eef7ee',
          100: '#d5ecd6',
          500: '#2f8f3e',
          600: '#237230',
          700: '#1b5a25',
          900: '#123a18'
        }
      }
    }
  },
  plugins: []
};
