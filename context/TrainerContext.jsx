"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchUserDetails } from "@/server_functions/auth";

const TrainerContext = createContext();

export const TrainerProvider = ({ children }) => {
    const [trainerData, setTrainerData] = useState(null); // State to hold user data
    const [trainerLoading, setTrainerLoading] = useState(true);
    const [trainerError, setTrainerError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setTrainerLoading(true);
                const details = await fetchUserDetails();
                setTrainerData(details);
            } catch (error) {
                console.error("Failed to fetch user details:", error);
                setTrainerError(error);
            } finally {
                setTrainerLoading(false);
            }
        };

        fetchDetails();
    }, []);

    return (
        <TrainerContext.Provider
            value={{
                trainerData,
                setTrainerData,
                trainerLoading,
                trainerError,
            }}
        >
            {children}
        </TrainerContext.Provider>
    );
};

export const useTrainer = () => useContext(TrainerContext);
