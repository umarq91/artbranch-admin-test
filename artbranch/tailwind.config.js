/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        light: "rgba(28,28,28,0.1)",
        dark: "#EEEAE4",
      },
      borderColor: {
        sideBorder: "rgba(28,28,28,0.1)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
