import type { Metadata } from "next";
import "../globals.css";
// import { ModeToggle } from "@/components/theme/theme-toggle";

export const metadata: Metadata = {
    title: "GymFlow | Movement Gyms",
    description: "A Lifestyle in Sai Ying Pun",
};

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <p>SIDEBAR</p>
            {/* <ModeToggle /> */}
            {children}
        </div>
    );
}
