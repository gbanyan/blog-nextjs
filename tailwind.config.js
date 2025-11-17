/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../Blog 文章原稿/**/*.{md,mdx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};

