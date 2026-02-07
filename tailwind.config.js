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
                "background-dark": "#0A0A0B", // Updated to match HTML

                "card-dark": "#161618", // Updated to match HTML
                "brand-red": "#E31B23",
                "charcoal": "#0F0F11", // Updated to match HTML
                "charcoal-light": "#1A1A1D", // Updated to match HTML
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
