"use client";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "@/configs/constants";
// Create the User Context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children, params }) => {
    const [userData, setUserData] = useState(null); // State to hold user data
    const [userLoading, setUserLoading] = useState(true);
    const [userError, setUserError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/mvmt/v1/trainer/clients/${params.id}`,

                    {
                        withCredentials: true, // Include cookies in the request
                    }
                );
                setUserData(response.data); // Assuming setUserData updates the user data
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUserError(error);
            } finally {
                setUserLoading(false);
            }
        };
        fetchData();
    }, [params.id]);

    return (
        <UserContext.Provider value={{ userData, userLoading, userError }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the User Context
export const useUser = () => useContext(UserContext);
