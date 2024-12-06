"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { logout } from "@/server_functions/auth";
import LoadingSpinner from "@/components/LoadingSpinner";
import Searchbar from "./pure-components/Searchbar";
import SearchResults from "./pure-components/SearchResults";
import { useGlobalContext } from "@/context/GlobalContextProvider";

const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { users } = useGlobalContext();
  const [showResults, setShowResults] = useState(false);
  const searchBarRef = useRef(null);

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

  const results = useMemo(() => {
    if (!search) return [];
    return users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, users]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      console.log("click");
      // Check if the click is outside the search bar container
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setShowResults(false); // Hide the search results if clicked outside
      } else {
        setShowResults(true); // Show the search results if clicked inside
      }
    };

    // Add an event listener to the document
    document.addEventListener("click", handleOutsideClick);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <nav className="w-full bg-white z-50">
      <div
        ref={searchBarRef}
        className="w-full flex flex-col justify-between items-center px-6 py-4 relative"
      >
        <Searchbar search={search} setSearch={setSearch} />
        {search.length > 0 && showResults && (
          <SearchResults results={results} setSearch={setSearch} />
        )}
        {/* <div className="flex space-x-4">
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
        </div> */}
      </div>
    </nav>
  );
};

export default Navbar;
