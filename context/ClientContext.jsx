"use client";
import { createContext, useContext, useState } from "react";

// Create the User Context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null); // State to hold user data

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the User Context
export const useUser = () => useContext(UserContext);
