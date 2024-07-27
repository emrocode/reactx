/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        reactx: {
          100: "#16181d",
          200: "#23272f",
          300: "#343a46",
        },
      },
    },
  },
  plugins: [],
};
