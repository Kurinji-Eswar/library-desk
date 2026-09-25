/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F1EBDD',
        creamSoft: '#E7E0D0',
        mint: '#A8D8D6',
        ink: '#20201C',
        blue: '#0789B2',
        grayish: '#8E8B80',
        amber: '#D58B62',
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', '"Space Mono"', 'monospace'],
        display: ['"Space Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        hard: '5px 5px 0 #20201C',
        hardsm: '3px 3px 0 #20201C',
        hardlg: '8px 8px 0 #20201C',
        hardxs: '2px 2px 0 #20201C',
      },
    },
  },
  plugins: [],
};
