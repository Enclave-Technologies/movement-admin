"use client";

import React, { useState } from "react";
import Link from "next/link";
import LoadingSpinner from "./LoadingSpinner";
import { logout } from "@/server_functions/auth";

const Sidebar = () => {
    const [loading, setLoading] = useState(false);

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
        <aside className="fixed top-0 left-0 w-64 h-full bg-green-800 text-white shadow-lg z-40 pt-16">
            <div className="p-4">
                <h2 className="text-xl font-bold mb-6 text-center">Menu</h2>
                <nav className="space-y-4">
                    <Link href="/my-clients">
                        <div className="flex items-center p-2 rounded-md hover:bg-green-700 cursor-pointer">
                            <span className="ml-2">My Clients</span>
                        </div>
                    </Link>
                    <Link href="/all-clients">
                        <div className="flex items-center p-2 rounded-md hover:bg-green-700 cursor-pointer">
                            <span className="ml-2">All Clients</span>
                        </div>
                    </Link>
                    <Link href="/settings">
                        <div className="flex items-center p-2 rounded-md hover:bg-green-700 cursor-pointer">
                            <span className="ml-2">Settings</span>
                        </div>
                    </Link>
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="w-48 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            disabled={loading}
                            onClick={handleLogout}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <LoadingSpinner />{" "}
                                    <span className="ml-2">Logging Out...</span>
                                </div>
                            ) : (
                                "Logout"
                            )}
                        </button>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
