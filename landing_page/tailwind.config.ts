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
                bg: "rgb(var(--color-bg-rgb) / <alpha-value>)",
                "bg-light": "rgb(var(--color-bg-light-rgb) / <alpha-value>)",
                text: "rgb(var(--color-text-rgb) / <alpha-value>)",
                "text-sub": "rgb(var(--color-text-sub-rgb) / <alpha-value>)",
                "text-light": "rgb(var(--color-text-light-rgb) / <alpha-value>)",
                accent: "rgb(var(--color-accent-rgb) / <alpha-value>)",
                "card-bg": "rgb(var(--color-card-bg-rgb) / <alpha-value>)",
                border: "rgb(var(--color-border-rgb) / <alpha-value>)",
                link: "rgb(var(--color-link-rgb) / <alpha-value>)",
            },
            fontFamily: {
                sans: ['"Noto Sans JP"', "sans-serif"],
                hand: ['"Zen Kurenaido"', '"Noto Sans JP"', "sans-serif"],
            },
            maxWidth: {
                content: "640px",
            },
            screens: {
                xs: "480px",
                sm: "640px",
                md: "768px",
                lg: "1024px",
                xl: "1280px",
            },
        },
    },
    plugins: [],
};
export default config;
