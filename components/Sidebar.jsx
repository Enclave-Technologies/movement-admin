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
  {
    label: "Logout",
    icon: IoLogOutOutline,
    href: "/help",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex">
      <aside className={` left-0 h-screen bg-primary text-white shadow-lg z-40 pt-16 transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
        <div className="px-4 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            {!isCollapsed && <TrainerInfo />} {/* Only show TrainerInfo if not collapsed */}
            <div onClick={toggleSidebar} className="text-white cursor-pointer mt-2">
              <AiOutlineMenu /> {/* Hamburger icon */}
            </div>
          </div>
          <nav className="space-y-4">
            {sidebarItems.map((item) => {
              const isItemActive = pathname === item.href;
              const className = isItemActive ? "bg-white text-primary" : "text-white";

              return (
                <Link href={item.href} key={item.label} className={className}>
                  <div className={`flex items-center p-3 rounded-md cursor-pointer ${className}`}>
                    {item.icon()} {/* Render the icon */}
                    <span className={`ml-2 ${isCollapsed ? "hidden" : ""}`}>{item.label}</span> {/* Show label only if not collapsed */}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className={`ml-${isCollapsed ? "16" : "64"} transition-all duration-300`}>
        {/* Your main content goes here */}
      </div>
    </div>
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
        <span className="text-center text-gray-300 text-sm">{trainer.description}</span>
      </div>
    </div>
  );
};

export default Sidebar;
