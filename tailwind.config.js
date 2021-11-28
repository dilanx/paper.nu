const colors = require('tailwindcss/colors');

module.exports = {
  purge: {
    content: ['./src/**/*.{js,jsx,ts,tsx,css}', './public/index.html'],
    safelist: [/(border|bg|text)-(.*)-(50|100|200|300|400|500|600|700|800|900)/]

  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      gray: colors.trueGray,
      red: colors.red,
      orange: colors.orange,
      amber: colors.amber,
      yellow: colors.yellow,
      lime: colors.lime,
      green: colors.green, 
      emerald: colors.emerald,
      teal: colors.teal,
      cyan: colors.cyan,
      sky: colors.sky,
      blue: colors.blue,
      indigo: colors.indigo,
      violet: colors.violet,
      purple: colors.purple,
      fuchsia: colors.fuchsia,
      pink: colors.pink,
      rose: colors.rose,
      white: colors.white,
      black: colors.black
    },
    extend: {
      spacing: {
        '128': '32rem'
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      backgroundOpacity: ['active'],
      display: ["group-hover", "group-focus"],
    },
  },
  plugins: [],
}
