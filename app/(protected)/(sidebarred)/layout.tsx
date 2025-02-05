"use client";
import Sidebar from "@/components/Sidebar";
import { TrainerProvider } from "@/context/TrainerContext";
import { StoreProvider } from "@/context/GlobalContextProvider";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };
    return (
        <StoreProvider>
            <TrainerProvider>
                <div className="flex flex-col h-screen bg-white">
                    <div
                        className={`fixed bg-white ${
                            isCollapsed ? "w-16" : "w-64"
                        } transition-all duration-300`}
                    >
                        <Sidebar
                            isCollapsed={isCollapsed}
                            toggleSidebar={toggleSidebar}
                        />
                    </div>
                    <div
                        className={`flex-1 flex flex-col ${
                            isCollapsed ? "ml-16" : "ml-64"
                        } overflow-y-auto transition-all duration-300 gap-4`}
                    >
                        <Navbar />
                        <div className={`px-2 flex-1`}>{children}</div>
                    </div>
                </div>
            </TrainerProvider>
        </StoreProvider>
    );
}
