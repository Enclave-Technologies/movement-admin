"use client";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL, LIMIT } from "@/configs/constants";
import { set } from "zod";
import { fetchUserDetails } from "@/server_functions/auth";

// Create the User Context
const StoreContext = createContext();

// Create a provider component
export const StoreProvider = ({ children }) => {
    const [trainers, setTrainers] = useState([]);
    const [exerciseHierarchy, setExerciseHierarchy] = useState(null);
    const [myDetails, setMyDetails] = useState(null);

    const fetchTrainers = async () => {
        const response = await axios.get(
            `${API_BASE_URL}/mvmt/v1/admin/trainers?limit=5000`,
            {
                withCredentials: true, // Include cookies in the request
            }
        );
        setTrainers(response.data.data);
    };

    const getExerciseHierarchy = async () => {
        const response = await axios.get(
            `${API_BASE_URL}/mvmt/v1/trainer/exerciseHierarchy`,
            {
                withCredentials: true, // Include cookies in the request
            }
        );
        setExerciseHierarchy(response.data);
    };

    const fetchMyDetails = async () => {
        const currentUser = await fetchUserDetails();
        setMyDetails(currentUser);
    };

    // Add a function to update the state
    const reloadData = () => {
        getExerciseHierarchy();
        fetchTrainers();
        fetchMyDetails();
    };

    useEffect(() => {
        const intervalId = setInterval(reloadData, 120 * 60 * 1000); // 120 minutes
        reloadData(); // Initial fetch
        return () => clearInterval(intervalId); // Clean up
    }, []);

    return (
        <StoreContext.Provider
            value={{
                exerciseHierarchy,
                trainers,
                myDetails,
                reloadData,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
};

// Custom hook to use the User Context
export const useGlobalContext = () => useContext(StoreContext);
