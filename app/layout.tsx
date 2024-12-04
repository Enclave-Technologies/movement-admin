import type { Metadata } from "next";
import { Quicksand, Roboto } from "next/font/google";
// import { Inter, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";

// const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// const ibmPlexSerif = IBM_Plex_Serif({
//     subsets: ["latin"],
//     variable: "--font-ibm-plex-serif",
//     weight: ["400", "700"],
// });

const quicksand = Quicksand({
    subsets: ["latin"],
    variable: "--font-quicksand",
});
const roboto = Roboto({
    subsets: ["latin"],
    variable: "--font-roboto",
    weight: ["400", "700"],
});

export const metadata: Metadata = {
    title: "Movement Fitness | Internal Dashboard - A Lifestyle in Sai Ying Pun",
    description: "A modern Gym for a fast life",
    icons: {
        icon: "/icon/logo.svg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            {/* <body className={`${inter.variable} ${ibmPlexSerif.variable}`}> */}
            <body className={`${quicksand.variable} ${roboto.variable}`}>
                {children}
            </body>
        </html>
    );
}
