/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1C1F24',
        paper: '#EDEEEA',
        line: '#3A3F46',
        copper: '#C4622D',
        teal: '#2F6E68',
        amber: '#E4A63B',
        muted: '#6B7078',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
      },
    },
  },
  plugins: [],
};
