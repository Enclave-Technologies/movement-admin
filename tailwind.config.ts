import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                primary: "#006847",
                white: "#FFFFFF",
                black: "#000000",
                gray: {
                    100: "#F7F7F7",
                    200: "#E5E5E5",
                    300: "#D4D4D4",
                    400: "#A3A3A3",
                    500: "#737373",
                    600: "#525252",
                    700: "#404040",
                    800: "#262626",
                    900: "#171717",
                },
                blue: {
                    500: "#3b82f6",
                    600: "#2563eb",
                    700: "#1d4ed8",
                },
                green: {
                    500: "#006747",
                    900: "#005536",
                },
                gold: {
                    500: "#E8B650",
                },
            },
        },
    },
    plugins: [],
};
export default config;
