/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#003366',
          surface: '#EDF4FF',
          hover: '#002244',
        },
        neutral: {
          main: '#1E1E1E',
          secondary: '#757575',
          white: '#FFFFFF',
          soft: '#F8F9FA',
          border: '#D0D0D0',
          input: '#D9D9D9',
        },
        feedback: {
          success: '#009951',
          danger: '#B3261E',
          successBg: '#E3FFF2',
          successBorder: '#A6F0CD',
          dangerBg: '#FFDFDD',
        },
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
      },
      fontSize: {
        h1: ['24px', { lineHeight: '27.6px', fontWeight: '400' }],
        h2: ['20px', { lineHeight: '23px', fontWeight: '700' }],
        'table-header': ['16px', { lineHeight: '18.4px', fontWeight: '700' }],
        body: ['16px', { lineHeight: '18.4px', fontWeight: '400' }],
      },
      borderRadius: {
        card: '14px',
        btn: '10px',
        input: '8px',
      },
      height: {
        btn: '37px',
        search: '45px',
      },
      padding: {
        'btn-x': '23px',
        'btn-y': '9px',
      },
      borderWidth: {
        card: '0.67px',
      },
    },
  },
  plugins: [],
};
