/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif','system-ui','-apple-system','Inter','Arial','sans-serif'],
        mono: ['ui-monospace','SFMono-Regular','Menlo','monospace'],
      },
      colors: {
        ink: "#0b1020",
        neon: "#00b9fc",
        myst: "#0c122b",
      },
      boxShadow: { glow: "0 0 60px rgba(0,185,252,0.18)" },
    },
  },
  plugins: [],
};
