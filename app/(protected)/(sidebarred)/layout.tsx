"use client";
import Sidebar from "@/components/Sidebar";
import { TrainerProvider } from "@/context/TrainerContext";
import { StoreProvider } from "@/context/GlobalContextProvider";
import { UnsavedChangesProvider } from "@/context/UnsavedChangesContext";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { logout } from "@/server_functions/auth";
import LoadingSpinner from "@/components/LoadingSpinner";
import { usePathname, useSearchParams } from 'next/navigation';

// Create a component to listen for navigation events
const NavigationEvents = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // When the URL changes, dispatch a custom event
    const event = new CustomEvent('navigationChanged', {
      detail: { pathname, searchParams: searchParams.toString() }
    });
    window.dispatchEvent(event);
  }, [pathname, searchParams]);
  
  return <>{children}</>;
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <StoreProvider>
            <TrainerProvider>
                <UnsavedChangesProvider savingState={loggingOut}>
                    <NavigationEvents>
                        <div className="flex flex-col h-screen bg-white">
                            <div
                                className={`fixed bg-white ${
                                    isCollapsed ? "w-16" : "w-64"
                                } transition-all duration-300`}
                            >
                                <Sidebar
                                    isCollapsed={isCollapsed}
                                    toggleSidebar={toggleSidebar}
                                    onLogoutClick={handleLogout}
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
                    </NavigationEvents>
                </UnsavedChangesProvider>
            </TrainerProvider>
        </StoreProvider>
    );
}
