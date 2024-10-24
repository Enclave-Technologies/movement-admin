"use client";

import React, { useState } from "react";
import Link from "next/link";
import { logout } from "@/server_functions/auth";
import LoadingSpinner from "@/components/LoadingSpinner";

const Navbar = () => {
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
    <nav className="fixed top-0 left-0 w-full bg-white bg-opacity-100 shadow-md z-50">
      <div className="flex justify-between items-center p-4">
        <div className="text-xl font-bold text-green-500 hover:text-green-900">
          {/* Placeholder for logo */}
          <Link href="/">
            <span>Logo</span>
          </Link>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="w-48 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            disabled={loading}
            onClick={handleLogout}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner /> <span className="ml-2">Logging Out...</span>
              </div>
            ) : (
              "Logout"
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
