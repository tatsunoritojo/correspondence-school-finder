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
                bg: "#F5F0E8",
                "bg-light": "#FAF7F2",
                text: "#333333",
                "text-sub": "#666666",
                "text-light": "#999999",
                accent: "#333333",
                "card-bg": "#FFFFFF",
                border: "#DDDDDD",
                link: "#2C5F9E",
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
