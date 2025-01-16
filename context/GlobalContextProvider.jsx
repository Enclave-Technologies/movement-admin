"use client";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL, LIMIT } from "@/configs/constants";

// Create the User Context
const StoreContext = createContext();

// Create a provider component
export const StoreProvider = ({ children }) => {
    const [users, setUsers] = useState([]); // State to hold user data
    const [exercises, setExercises] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [countDoc, setCountDoc] = useState(null);
    const fetchUsers = async () => {
        const response = await axios.get(
            `${API_BASE_URL}/mvmt/v1/trainer/clients?limit=${LIMIT}`,
            {
                withCredentials: true, // Include cookies in the request
            }
        );
        setUsers(response.data.data);
    };

    const fetchExercises = async () => {
        const response = await axios.get(
            `${API_BASE_URL}/mvmt/v1/admin/exercises?limit=1000`,
            {
                withCredentials: true,
            }
        );
        setExercises(response.data.data);
    };

    const fetchTrainers = async () => {
        const response = await axios.get(
            `${API_BASE_URL}/mvmt/v1/admin/trainers?limit=${LIMIT}`,
            {
                withCredentials: true, // Include cookies in the request
            }
        );
        setTrainers(response.data.data);
    };
    const fetchCounts = async () => {
        const response = await axios.get(
            `${API_BASE_URL}/mvmt/v1/trainer/get-counts`,
            {
                withCredentials: true, // Include cookies in the request
            }
        );
        setCountDoc(response.data);
    };

    // Add a function to update the state
    const reloadData = () => {
        fetchCounts();
        fetchUsers();
        fetchExercises();
        fetchTrainers();
    };

    useEffect(() => {
        const intervalId = setInterval(reloadData, 120 * 60 * 1000); // 120 minutes
        reloadData(); // Initial fetch
        return () => clearInterval(intervalId); // Clean up
    }, []);

    return (
        <StoreContext.Provider
            value={{
                countDoc,
                users,
                exercises,
                trainers,
                setUsers,
                setExercises,
                setTrainers,
                reloadData,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
};

// Custom hook to use the User Context
export const useGlobalContext = () => useContext(StoreContext);
