"use client";
import React, { useState } from "react";
import Link from "next/link";
import { LuUsers2 } from "react-icons/lu";
import { PiUsersFour } from "react-icons/pi";
import { FiSettings } from "react-icons/fi";
import { IoLogOutOutline } from "react-icons/io5";
import { AiOutlineMenu } from "react-icons/ai";
import { RiAdminFill } from "react-icons/ri";
import { usePathname } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";
import { logout } from "@/server_functions/auth";
import TrainerInfo from "./TrainerInfo";
import { useTrainer } from "@/context/TrainerContext";
import Image from "next/image";

const sidebarItems = [
    {
        label: "My Clients",
        icon: RiAdminFill,
        href: "/my-clients",
    },
    {
        label: "Users",
        icon: RiAdminFill,
        href: "/users",
    },
    {
        label: "Coaching Team",
        icon: LuUsers2,
        href: "/coaching-team",
    },

    {
        label: "Exercise Library",
        icon: PiUsersFour,
        href: "/exercise-library",
    },
    {
        label: "Settings",
        icon: FiSettings,
        href: "/settings",
    },
];

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
    const pathname = usePathname();
    const {
        trainerData,
        trainerLoading: loading,
        trainerError: error,
    } = useTrainer();
    const [loadingLogout, setLoadingLogout] = useState(false);

    // console.log(trainerData);

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
            className={`sticky top-0 left-0 h-screen bg-white text-primary z-40 pt-4 ${
                isCollapsed ? "w-16" : "w-64"
            } transition-all duration-300`}
        >
            <div
                className={`${
                    isCollapsed ? "px-0" : "px-4"
                } flex flex-col justify-between gap-4 h-full`}
            >
                <div className="flex flex-col gap-4 h-full">
                    <div
                        className={`flex flex-row ${
                            isCollapsed ? "justify-center" : "justify-between"
                        } w-full top-0 left-0 px-2 min-h-8`}
                    >
                        <Image
                            src={require("@/public/images/Symbol-movement.svg")}
                            className={`aspect-square object-cover rounded-full ${
                                isCollapsed ? "hidden" : "block"
                            }`}
                            alt={"Movement Logo"}
                            // unoptimized
                            width={32}
                            height={32}
                        />

                        <button onClick={toggleSidebar}>
                            <AiOutlineMenu />
                        </button>
                    </div>

                    <nav className="flex flex-col space-y-2 p-2 gap-[2px]">
                        {sidebarItems.map((item) => {
                            const isItemActive = pathname === item.href;
                            const className = isItemActive
                                ? "bg-white text-primary font-bold"
                                : "text-slate-500 hover:text-primary hover:bg-slate-100 transition-colors";

                            // Check if the user is an admin and the item is for the admin panel
                            // if (
                            //     trainerData?.team.name === "Admins" &&
                            //     item.href.includes("admin")
                            // ) {
                            //     return (
                            //         <Link href={item.href} key={item.label}>
                            //             <div
                            //                 className={`flex items-center ${
                            //                     isCollapsed
                            //                         ? "justify-center h-12 w-12"
                            //                         : "justify-start p-3"
                            //                 } rounded-md cursor-pointer ${className}`}
                            //             >
                            //                 {loading ? (
                            //                     <div className="animate-pulse">
                            //                         <div className="bg-gray-300 rounded-full w-6 h-6"></div>
                            //                     </div>
                            //                 ) : (
                            //                     <item.icon className="w-6 h-6" />
                            //                 )}
                            //                 {!isCollapsed && (
                            //                     <span className="ml-2">
                            //                         {loading ? "" : item.label}
                            //                     </span>
                            //                 )}
                            //             </div>
                            //         </Link>
                            //     );
                            // }

                            // Render other sidebar items regardless of the team
                            return (
                                <Link href={item.href} key={item.label}>
                                    <div
                                        className={`flex items-center ${
                                            isCollapsed
                                                ? "justify-center h-12 w-12"
                                                : "justify-start p-2"
                                        } rounded-md cursor-pointer ${className}`}
                                    >
                                        {loading ? (
                                            <div className="animate-pulse">
                                                <div className="bg-gray-300 rounded-full w-6 h-6"></div>
                                            </div>
                                        ) : (
                                            <item.icon className="w-4 h-4" />
                                        )}
                                        {!isCollapsed && (
                                            <span className="ml-2">
                                                {loading ? "" : item.label}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <div
                    className={`${
                        isCollapsed ? "p-2" : "p-3"
                    } flex flex-col gap-4`}
                >
                    {!isCollapsed ? (
                        <TrainerInfo
                            userDetails={trainerData}
                            loading={loading}
                            error={error}
                        />
                    ) : (
                        <div className="w-16 h-40"></div>
                    )}
                    <button
                        type="submit"
                        className="w-full h-12 py-2 border border-transparent 
                                rounded-md shadow-sm text-sm font-medium text-white
                                bg-gold-500 hover:bg-green-500 hover:border-gold-500 
                                focus:outline-none focus:ring-2 focus:ring-offset-2
                                focus:ring-gold-500 transform hover:-translate-y-0.5"
                        disabled={loadingLogout}
                        onClick={handleLogout}
                    >
                        {loadingLogout ? (
                            <div className="flex items-center justify-center select-none gap-2">
                                <LoadingSpinner className="w-4 h-4 aspect-square" />
                                {!isCollapsed && (
                                    <span className="ml-2">Logging Out...</span>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center select-none gap-2">
                                <IoLogOutOutline className="w-6 h-6 stroke-2" />
                                {!isCollapsed && <span>Logout</span>}
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
