/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "media",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0369a1",
        accent: "#06b6d4"
      },
      transitionProperty: {
        height: "height"
      }
    }
  },
  plugins: []
};
