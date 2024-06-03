import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        hero: "url('https://res.cloudinary.com/dvuh4fz9d/image/upload/v1648390942/farm-compressed_dqjqsw.webp')",
        "gradient-button":
          "linear-gradient(90deg, #741e1e 0, #003d2b 51%, #741e1e);",
      },
      gridTemplateColumns: {
        categories: "repeat(auto-fit, minmax(18rem, 25rem))",
      },
      height: {
        hero: "80vh",
      },
      boxShadow: {
        button: "0 0 20px #eee",
      },
      colors: {
        primary: "#003d2b",
        "extra-light-green": "#e1f7f2",
        "light-green": "#84fab0",
        "dark-green": "#008000",
        "light-blue": "#8fd3f4",
        "dark-brown": "#741e1e",
      },
    },
  },
  plugins: [],
};
export default config;
