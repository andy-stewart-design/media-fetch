/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");

module.exports = {
  darkMode: ["class", ".figma-dark"],
  content: ["./src/**/*.{html,js,svelte,ts,svg}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      colors: {
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        "surface-high": "rgb(var(--surface-high) / <alpha-value>)",
        "surface-low": "rgb(var(--surface-low) / <alpha-value>)",
        background: "rgb(var(--background) / <alpha-value>)",
        black: "rgb(var(--black) / <alpha-value>)",
        overlay: "rgb(var(--overlay) / <alpha-value>)",
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
