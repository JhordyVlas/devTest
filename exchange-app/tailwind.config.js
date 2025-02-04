/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["'Roboto Mono'", "Sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
