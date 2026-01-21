import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kwooka: {
          50: '#fef7ee',
          100: '#fcecd6',
          200: '#f8d5ac',
          300: '#f3b778',
          400: '#ed9042',
          500: '#e8721d',
          600: '#d95813',
          700: '#b44212',
          800: '#903516',
          900: '#742e15',
        },
        ochre: {
          50: '#fdfaf5',
          100: '#f9f1e1',
          200: '#f2dfc3',
          300: '#e9c79c',
          400: '#dea76c',
          500: '#d58d4a',
          600: '#c7753d',
          700: '#a65c34',
          800: '#854a30',
          900: '#6c3e2a',
        },
        earth: {
          50: '#f8f6f4',
          100: '#efeae5',
          200: '#ddd4ca',
          300: '#c7b8a8',
          400: '#ae9785',
          500: '#9d806c',
          600: '#907260',
          700: '#785d51',
          800: '#634e45',
          900: '#52423a',
        },
        cream: '#FDF6E9',
        sand: '#D4A574',
      },
    },
  },
  plugins: [],
};
export default config;
