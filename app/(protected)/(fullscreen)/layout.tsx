import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
    title: "GymFlow | Movement Fitness",
    description: "A Lifestyle in Sai Ying Pun",
};

export default async function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // const LoggedInUser = await get_logged_in_user();

    return <div>{children}</div>;
}
