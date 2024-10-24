"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LuUsers2 } from "react-icons/lu";
import { PiUsersFour } from "react-icons/pi";
import { FiSettings } from "react-icons/fi";
import { IoLogOutOutline } from "react-icons/io5";
import { AiOutlineMenu } from "react-icons/ai"; // Hamburger icon import
import { usePathname } from "next/navigation";
import Image from "next/image";
import LoadingSpinner from "./LoadingSpinner";
import { logout } from "@/server_functions/auth";

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

    // {
    //   label: "Logout",
    //   icon: IoLogOutOutline,
    //   href: "/help",
    // },
];

const Sidebar = () => {
    const pathname = usePathname();
    useEffect(() => {}, [pathname]);
    const [loading, setLoading] = useState(false);

    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            // redirection is being handled in the backend
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <aside className="sticky top-0 left-0 w-64 h-screen bg-primary text-white shadow-lg z-40 pt-16">
            <div className="px-4 flex flex-col gap-4">
                <TrainerInfo />
                <nav className="space-y-4">
                    {sidebarItems.map((item) => {
                        var isItemActive = pathname === item.href;
                        var className = isItemActive
                            ? "bg-white text-primary"
                            : "text-white";
                        return (
                            <Link href={item.href} key={item.label}>
                                <div
                                    className={`flex items-center p-3 rounded-md cursor-pointer ${className}`}
                                >
                                    {item.icon()}
                                    <span className="ml-2">{item.label}</span>
                                </div>
                            </Link>
                        );
                    })}
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="w-48 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            disabled={loading}
                            onClick={handleLogout}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <LoadingSpinner />{" "}
                                    <span className="ml-2">Logging Out...</span>
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <IoLogOutOutline className="w-6 h-6 stroke-2 mr-2" />{" "}
                                    Logout
                                </div>
                            )}
                        </button>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

const TrainerInfo = () => {
    const trainer = {
        name: "Kenny C",
        image: "https://movementfitnesshk.com/wp-content/uploads/2024/01/Kenny-Cheung-web600x800_Movement-Fitness.jpg",
        description: "Personal Trainer | Body Transformation",
    };
    return (
        <div className="flex flex-col items-center gap-1">
            <Image
                src={trainer.image}
                className="aspect-square object-cover rounded-full"
                alt="Kenny C"
                unoptimized
                width={80}
                height={80}
            />
            <div className="flex flex-col items-center gap-0.5">
                <h2>{trainer.name}</h2>
                <span className="text-center text-gray-300 text-sm">
                    {trainer.description}
                </span>
            </div>
        </div>
    );
};

export default Sidebar;
