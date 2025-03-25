"use client";
import Sidebar from "@/components/Sidebar";
import { TrainerProvider } from "@/context/TrainerContext";
import { StoreProvider } from "@/context/GlobalContextProvider";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { logout } from "@/server_functions/auth";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [loadingLogout, setLoadingLogout] = useState(false);

    const handleLogout = async () => {
        setLoadingLogout(true);
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoadingLogout(false);
        }
    };

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
                            onLogoutClick={() => setShowLogoutDialog(true)}
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

                    {showLogoutDialog && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-md w-[400px] max-w-[90%]">
                                <p className="text-black">
                                    Are you sure you want to logout?
                                </p>
                                <div className="mt-10 flex justify-end gap-2">
                                    <button
                                        className="bg-gray-300 text-black px-4 py-2 rounded-lg transition-transform active:scale-95"
                                        onClick={() => setShowLogoutDialog(false)}
                                        disabled={loadingLogout}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg transition-transform active:scale-95"
                                        onClick={handleLogout}
                                        disabled={loadingLogout}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            {loadingLogout ? (
                                                <>
                                                    <LoadingSpinner className="h-4 w-4" />
                                                    <span>Logging out...</span>
                                                </>
                                            ) : (
                                                "Yes, Logout"
                                            )}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </TrainerProvider>
        </StoreProvider>
    );
}
