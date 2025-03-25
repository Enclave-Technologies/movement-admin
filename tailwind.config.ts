import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
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
            keyframes: {
                fadeIn: {
                  '0%': { opacity: '0' },
                  '100%': { opacity: '1' },
                },
                slideIn: {
                  '0%': { transform: 'translateY(-20px)', opacity: '0' },
                  '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
            animation: {
                fadeIn: 'fadeIn 0.3s ease-out',
                slideIn: 'slideIn 0.3s ease-out',
            },
            colors: {
                primary: "#006747",
                white: "#FFFFFF",
                black: "#000000",
                gray: {
                    "100": "#F7F7F7",
                    "200": "#E5E5E5",
                    "300": "#D4D4D4",
                    "400": "#A3A3A3",
                    "500": "#737373",
                    "600": "#525252",
                    "700": "#404040",
                    "800": "#262626",
                    "900": "#171717",
                },
                blue: {
                    "500": "#3b82f6",
                    "600": "#2563eb",
                    "700": "#1d4ed8",
                },
                green: {
                    "300": "#E1FF74",
                    "500": "#006747",
                    "800": "#03140F",
                    "900": "#005536",
                },
                gold: {
                    "500": "#E8B650",
                },
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    "1": "hsl(var(--chart-1))",
                    "2": "hsl(var(--chart-2))",
                    "3": "hsl(var(--chart-3))",
                    "4": "hsl(var(--chart-4))",
                    "5": "hsl(var(--chart-5))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
        },
    },
    plugins: [
        function ({ addUtilities }) {
            addUtilities({
                ".touch-action-none": {
                    "touch-action": "none",
                },
            });
        },
        require("tailwindcss-animate"),
    ],
};
export default config;
