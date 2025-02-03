// dashboard/layout.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const tabs = [
    { label: "Tracked Exercises", href: "/dashboard/tracked-exercises" },
    { label: "Workout Planner", href: "/dashboard/workout-planner" },
    { label: "Goals", href: "/dashboard/goals" },
];

const DashboardLayout = ({ children }) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(tabs[0].href);

    const handleTabChange = (href) => {
        router.push(href);
        setActiveTab(href);
    };

    return (
        <div className="flex flex-col h-full">
            <nav className="flex bg-gray-100 border-b">
                {tabs.map((tab) => (
                    <button
                        key={tab.href}
                        onClick={() => handleTabChange(tab.href)}
                        className={`px-4 py-3 transition-colors ${
                            activeTab === tab.href
                                ? "bg-gray-300 text-gray-800"
                                : "hover:bg-gray-200 text-gray-600"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
            <main className="flex-grow p-6">{children}</main>
        </div>
    );
};

export default DashboardLayout;
