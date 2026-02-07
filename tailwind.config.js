/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx}",
        "./src/pages/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#E31B23",
                "doz-red": "#E31B23",
                "doz-grey": "#BDBDBD",

                "background-light": "#f7f6f8",
                "background-dark": "#0a0a0a",

                "card-dark": "#1a1a1a",
                "brand-red": "#E31B23",
                "charcoal": "#27272a",
                "charcoal-light": "#3f3f46",
            },
            fontFamily: {
                display: ["Spline Sans", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "0.25rem",
                lg: "0.5rem",
                xl: "0.75rem",
                full: "9999px",
            },
        },
    },
    plugins: [],
};
