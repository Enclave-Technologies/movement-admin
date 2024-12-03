"use client";
import Sidebar from "@/components/Sidebar";
import { TrainerProvider } from "@/context/TrainerContext";
import { StoreProvider } from "@/context/GlobalContextProvider";
import { useState } from "react";

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
            <div className="flex flex-col h-screen">
                <div
                    className={`fixed bg-gray-200 ${
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
                    className={`flex-1 ${
                        isCollapsed ? "ml-16" : "ml-64"
                    } overflow-y-auto p-4 bg-gray-100 transition-all duration-300`}
                >
                    {children}
                </div>
            </div>
        </StoreProvider>
    );
}
