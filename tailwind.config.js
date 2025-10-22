/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          400: "#3B82F6", // Vibrant blue for focus rings, buttons
          900: "#1E3A8A", // Dark blue for text
        },
        secondary: {
          50: "#E6FFFA", // Light teal for backgrounds
          800: "#2DD4BF", // Rich teal for text, accents
        },
        gray: {
          300: "#D1D5DB", // border-gray-300
          700: "#4B5563", // text-gray-700 (labels)
        },
        black: "#000000", // text-black
        white: "#FFFFFF", // bg-white
        placeholder: {
          gray: "#9CA3AF", // placeholder-gray-400
        },
      },
      spacing: {
        1: "0.25rem", // space-y-1
        2: "0.5rem", // gap-2
        3: "0.75rem", // px-3, right-3
        4: "1rem", // space-y-4, gap-4
        9: "2.25rem", // top-9
        32: "8rem", // w-32
      },
      borderRadius: {
        md: "0.375rem", // rounded-md
        lg: "0.5rem", // rounded-lg
      },
      fontSize: {
        sm: ["0.875rem", { lineHeight: "1.25rem" }], // text-sm
      },
      fontWeight: {
        medium: 500, // font-medium
      },
      ringWidth: {
        2: "2px", // focus:ring-2
      },
      ringColor: {
        primary: {
          400: "#3B82F6", // focus:ring-primary-400
        },
      },
    },
  },
  plugins: [],
};
