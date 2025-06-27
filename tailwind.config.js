/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    // colors: colors.light,
    extend: {
      colors: {
        primary: {
          0: "rgb(var(--color-primary-0)/<alpha-value>)",
          50: "rgb(var(--color-primary-50)/<alpha-value>)",
          100: "rgb(var(--color-primary-100)/<alpha-value>)",
          200: "rgb(var(--color-primary-200)/<alpha-value>)",
          300: "rgb(var(--color-primary-300)/<alpha-value>)",
          400: "rgb(var(--color-primary-400)/<alpha-value>)",
          500: "rgb(var(--color-primary-500)/<alpha-value>)",
        },
        secondary: "rgb(var(--color-secondary)/<alpha-value>)",
        text: "rgb(var(--color-text)/<alpha-value>)",
      },
    },
  },
  plugins: [
    // Set a default value on the `:root` element
    // ({ addBase }) =>
    //   addBase({
    //     ":root": {
    //       "--color-primary": "rgb(255 0 0)",
    //     },
    //   }),
  ],
};
