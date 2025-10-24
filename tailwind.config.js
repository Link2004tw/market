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
          100: "#DBEAFE", // Very light blue for subtle backgrounds
          200: "#BFDBFE",
          400: "#3B82F6", // Vibrant blue for buttons, focus rings
          600: "#2563EB", // Slightly darker for hover
          900: "#1E3A8A", // Dark blue for text, headers
        },
        secondary: {
          100: "#F0FDFA", // Very light teal for backgrounds
          200: "#CCFBF1",
          400: "#5EEAD4", // Bright teal for accents
          800: "#2DD4BF", // Rich teal for text, icons
        },
        accent: {
          400: "#F59E0B", // Soft orange for hover states, secondary actions
          600: "#D97706", // Darker orange for hover
        },
        gray: {
          50: "#F9FAFB", // Very light gray for backgrounds
          100: "#F3F4F6", // Subtle backgrounds
          200: "#E5E7EB", // Light borders
          300: "#D1D5DB", // Borders
          400: "#9CA3AF", // Placeholder text
          600: "#4B5563", // Hover states, secondary text
          700: "#374151", // Primary text, labels
          800: "#1F2937", // Darker elements
          900: "#111827", // Darkest text
        },
        black: "#000000", // text-black
        white: "#FFFFFF", // bg-white
      },
      spacing: {
        1: "0.25rem", // space-y-1
        2: "0.5rem", // gap-2
        3: "0.75rem", // px-3, right-3
        4: "1rem", // space-y-4, gap-4
        6: "1.5rem", // py-6
        8: "2rem", // top-8
        12: "3rem", // h-12 for textarea
        32: "8rem", // w-32
        68: "68px", // h-[68px]
      },
      borderRadius: {
        md: "0.375rem", // rounded-md
        lg: "0.5rem", // rounded-lg
        xl: "0.75rem", // rounded-xl
        full: "9999px", // rounded-full
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }], // text-xs
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
