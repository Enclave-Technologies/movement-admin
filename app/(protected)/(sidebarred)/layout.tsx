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
            <div className="flex flex-col h-screen bg-gray-100">
                <div
                    className={`fixed bg-white ${
                        isCollapsed ? "w-16" : "w-64"
                    } transition-all duration-300`}
                >
                    <TrainerProvider>
                        <Sidebar
                            isCollapsed={isCollapsed}
                            toggleSidebar={toggleSidebar}
                        />
                    </TrainerProvider>
                </div>
                <div
                    className={`flex-1 flex flex-col ${
                        isCollapsed ? "ml-16" : "ml-64"
                    } overflow-y-auto transition-all duration-300  `}
                >
                    <Navbar />
                    <div className={`p-6`}>{children}</div>
                </div>
            </div>
        </StoreProvider>
    );
}
