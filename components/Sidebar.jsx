"use client";
import React from "react";
import Link from "next/link";
import { LuUsers2 } from "react-icons/lu";
import { FiSettings } from "react-icons/fi";
import { IoLogOutOutline } from "react-icons/io5";
import { AiOutlineMenu } from "react-icons/ai";
import { usePathname } from "next/navigation";
import TrainerInfo from "./TrainerInfo";
import { useTrainer } from "@/context/TrainerContext";
import Image from "next/image";
import { FaUsers, FaUsersLine } from "react-icons/fa6";
import { LiaDumbbellSolid } from "react-icons/lia";

const sidebarItems = [
  {
    label: "My Clients",
    icon: FaUsersLine,
    href: "/my-clients",
  },
  {
    label: "Users",
    icon: FaUsers,
    href: "/users",
  },
  {
    label: "Coaching Team",
    icon: LuUsers2,
    href: "/coaching-team",
  },

  {
    label: "Exercise Library",
    icon: LiaDumbbellSolid,
    href: "/exercise-library",
  },
  {
    label: "Settings",
    icon: FiSettings,
    href: "/settings",
  },
];

const Sidebar = ({ isCollapsed, toggleSidebar, onLogoutClick }) => {
  const pathname = usePathname();
  const {
    trainerData,
    trainerLoading: loading,
    trainerError: error,
  } = useTrainer();

  return (
    <div
      className={`sticky top-0 left-0 h-screen bg-gray-100 text-primary z-40 pt-4 ${
        isCollapsed ? "w-16" : "w-64"
      } transition-all duration-300`}
    >
      <div
        className={`${
          isCollapsed ? "px-0" : "px-2"
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

          <nav className="flex flex-col p-2 gap-[2px]">
            {sidebarItems.map((item) => {
              const isItemActive = pathname === item.href;
              const className = isItemActive
                ? "bg-white text-primary font-bold"
                : "text-slate-500 hover:text-primary hover:bg-white/75 transition-colors";

              // Render other sidebar items regardless of the team
              return (
                <Link href={item.href} key={item.label}>
                  <div
                    className={`flex items-center whitespace-nowrap ${
                      isCollapsed ? "justify-center p-2" : "justify-start p-2"
                    } rounded-md cursor-pointer ${className}`}
                  >
                    {loading ? (
                      <div className="animate-pulse">
                        <div className="bg-gray-300 rounded-full w-6 h-6"></div>
                      </div>
                    ) : (
                      <item.icon className="w-[16px] h-[16px]" />
                    )}
                    {!isCollapsed && (
                      <span className="ml-2">{loading ? "" : item.label}</span>
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
          } flex flex-col gap-4 pb-32 md:pb-4`}
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
                                bg-green-500 hover:bg-green-900
                                focus:outline-none focus:ring-2 focus:ring-offset-2
                                transition duration-3000 ease-in-out transform"
            onClick={onLogoutClick}
          >
            <div className="flex items-center justify-center select-none gap-2">
              <IoLogOutOutline className="w-6 h-6 stroke-2" />
              {!isCollapsed && <span>Logout</span>}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
