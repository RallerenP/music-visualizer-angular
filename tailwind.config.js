const { guessProductionMode } = require("@ngneat/tailwind");

process.env.TAILWIND_MODE = guessProductionMode() ? 'build' : 'watch';

module.exports = {
    prefix: '',
    mode: 'jit',
    purge: {
      content: [
        './src/**/*.{html,ts,css,scss,sass,less,styl}',
      ]
    },
    darkMode: 'class', // or 'media' or 'class'
    theme: {
      extend: {
        colors: {
          charcoal: {
            brighter: "#3A6B7E",
            primary: "#264653",
            darker: "#13242A"
          },
          "persian-green": {
            brighter: "#3ECCBB",
            primary: "#2A9D8F",
            darker: "#1E7161"
          },
          "orange-yellow-crayola": {
            brighter: "#F2DCA6",
            primary: "#E9C46A",
            darker: "#E4BA4E"
          },
          "sandy-brown": {
            brighter: "#F8C8A0",
            primary: "#F4A261",
            darker: "#F0852D"
          },
          "burnt-sienna": {
            brighter: "#F0A693",
            primary: "#E76F51",
            darker: "E24D28"
          }
        }
      },
    },
    variants: {
      extend: {},
    },
    plugins: [require('@tailwindcss/aspect-ratio'),require('@tailwindcss/forms'),require('@tailwindcss/line-clamp'),require('@tailwindcss/typography')],
};
