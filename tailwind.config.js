/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  content: [
    "./src/**/*.{html,ts,tsx}",
    "./public/**/*.html",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        "primary-light": "#f0f0f0",
        "secondary-light": "#dddddd",
        header: "#444444",
        sidebar: "#333333",
        dark: "#555555",
        light: "#f9f9f9",
        "primary-dark": "#000000",
      },
      translate: {
        "w-54": "14rem",
      },
      width: {
        "w-4/5": "80%",
      },
      maxHeight: {
        "max-h-45": "45rem",
      },
    },
  },
  plugins: [require("tw-elements/dist/plugin.cjs")],
};
