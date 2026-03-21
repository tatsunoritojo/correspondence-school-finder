import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        plugin(function ({ addVariant }) {
            // @media (hover: hover) — マウス操作時のみ hover を適用
            addVariant("hover-hover", "@media (hover: hover)");
        }),
    ],
}
