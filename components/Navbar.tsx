"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { logout } from "@/server_functions/auth";
import LoadingSpinner from "@/components/LoadingSpinner";
import Searchbar from "./pure-components/Searchbar";
import SearchResults from "./pure-components/SearchResults";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import TrainerInfo from "./TrainerInfo";
import { useTrainer } from "@/context/TrainerContext";
import Image from "next/image";
import { API_BASE_URL, defaultProfileURL, LIMIT } from "@/configs/constants";
import axios from "axios";

const Navbar = () => {
    const [loadingResults, setLoadingResults] = useState(false);
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const searchBarRef = useRef(null);
    const {
        trainerData,
        trainerLoading: loading,
        trainerError: error,
    } = useTrainer();

    const trainer: trainerSidebarInfo = {
        name: `${trainerData?.firstName || "FirstName"} ${
            trainerData?.lastName || "LastName"
        }`,
        image: trainerData?.imageURL || defaultProfileURL,
        description:
            trainerData?.jobTitle || "Personal Trainer | Body Transformation",
    };

    useEffect(() => {
        const fetchUsers = async () => {
            setLoadingResults(true);
            if (search) {
                try {
                    const url = new URL(
                        `${API_BASE_URL}/mvmt/v1/trainer/clients`
                    );
                    url.searchParams.set("limit", LIMIT.toString());
                    url.searchParams.set("pageNo", "1");
                    url.searchParams.set("search_query", search);
                    const response = await axios.get(url.toString(), {
                        withCredentials: true,
                    });

                    const { data, total } = response.data;

                    console.log(total);
                    if (data) {
                        setUsers(data);
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            setLoadingResults(false);
        };
        fetchUsers();
    }, [search]);

    const results = useMemo(() => {
        if (!search) return [];
        return users.filter((user) =>
            user.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, users]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            // console.log("click");
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
        <nav className="sticky top-0 w-full bg-white/90 blur-0 z-10">
            <div className="flex-1 flex flex-row justify-between items-center relative">
                <div
                    ref={searchBarRef}
                    className="relative flex flex-col items-center flex-1"
                >
                    <Searchbar search={search} setSearch={setSearch} />
                    {search.length > 0 && showResults && (
                        <SearchResults
                            results={results}
                            setSearch={setSearch}
                            isLoading={loadingResults}
                        />
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
