"use client";
import React, { useState } from "react";
import Link from "next/link";
import { LuUsers2 } from "react-icons/lu";
import { PiUsersFour } from "react-icons/pi";
import { FiSettings } from "react-icons/fi";
import { IoLogOutOutline } from "react-icons/io5";
import { AiOutlineMenu } from "react-icons/ai";
import { usePathname } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";
import { logout } from "@/server_functions/auth";
import TrainerInfo from "./TrainerInfo";
import { useTrainer } from "@/context/TrainerContext";

const sidebarItems = [
    {
        label: "My Clients",
        icon: LuUsers2,
        href: "/my-clients",
    },
    {
        label: "All Clients",
        icon: PiUsersFour,
        href: "/all-clients",
    },
    {
        label: "Settings",
        icon: FiSettings,
        href: "/settings",
    },
];

const Sidebar = () => {
    const pathname = usePathname();
    const {
        trainerData,
        trainerLoading: loading,
        trainerError: error,
    } = useTrainer();
    const [loadingLogout, setLoadingLogout] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

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

    return (
        <div
            className={`sticky top-0 left-0 h-screen bg-primary text-white shadow-lg z-40 pt-16 ${
                isCollapsed ? "w-16" : "w-64"
            } transition-all duration-300`}
        >
            <div
                className={`${
                    isCollapsed ? "px-0" : "px-4"
                } flex flex-col gap-4 h-full`}
            >
                <button
                    onClick={toggleSidebar}
                    className="absolute top-4 right-6"
                >
                    <AiOutlineMenu />
                </button>
                {!isCollapsed ? (
                    <TrainerInfo
                        userDetails={trainerData}
                        loading={loading}
                        error={error}
                    />
                ) : (
                    <div className="w-16 h-40"></div>
                )}

                <nav className="flex flex-col space-y-2 p-2 gap-[2px]">
                    {sidebarItems.map((item) => {
                        const isItemActive = pathname === item.href;
                        const className = isItemActive
                            ? "bg-white text-primary"
                            : "text-white hover:bg-gold-500 transition-colors";

                        return (
                            <Link href={item.href} key={item.label}>
                                <div
                                    className={`flex items-center ${
                                        isCollapsed
                                            ? "justify-center h-12 w-12"
                                            : "justify-start p-3"
                                    } rounded-md cursor-pointer ${className}`}
                                >
                                    <item.icon className="w-6 h-6" />
                                    {!isCollapsed && (
                                        <span className="ml-2">
                                            {item.label}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>
                <div className={`${isCollapsed ? "p-2" : "p-3"}`}>
                    <button
                        type="submit"
                        className="w-full py-2 border border-transparent 
                        rounded-md shadow-sm text-sm font-medium text-white
                         bg-gold-500 hover:bg-green-500 hover:border-gold-500 
                         focus:outline-none focus:ring-2 focus:ring-offset-2
                          focus:ring-gold-500 transform hover:-translate-y-0.5"
                        disabled={loadingLogout}
                        onClick={handleLogout}
                    >
                        {loadingLogout ? (
                            <div className="flex items-center justify-center">
                                <LoadingSpinner />
                                {!isCollapsed && (
                                    <span className="ml-2">Logging Out...</span>
                                )}
                            </div>
                        ) : (
                            <div
                                className={`flex items-center px-3 hover:underline ${
                                    isCollapsed ? "gap-0" : "gap-2"
                                }`}
                            >
                                <IoLogOutOutline
                                    className={`w-6 h-6 stroke-2 ${
                                        isCollapsed ? "mr-0" : "mr-2"
                                    }`}
                                />
                                {!isCollapsed && "Logout"}
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
