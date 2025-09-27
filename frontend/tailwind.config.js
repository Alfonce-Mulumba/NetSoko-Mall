import forms from "@tailwindcss/forms";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#111827",   // dark
        accent: "#7c3aed",    // purple-ish
        brand: "#0ea5a4"
      }
    }
  },
  plugins: [forms],
};
