/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");

module.exports = {
  darkMode: ["class", ".figma-dark"],
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      colors: {
        figma: {
          blue: `#18a0fb`,
          purple: "#7b61ff",
          "hot-pink": "#ff00ff",
          green: "#1bc47d",
          red: "#f24822",
          yellow: "#ffeb00",
          gray: {
            700: "#383838",
            800: "#2c2c2c",
            900: "#1e1e1e",
          },
        },
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("active", ".active&");
      addVariant("selection", "&::selection");
    }),
  ],
};
