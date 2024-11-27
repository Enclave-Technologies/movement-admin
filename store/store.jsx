"use client";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Create the User Context
const StoreContext = createContext();

// Create a provider component
export const StoreProvider = ({ children }) => {
  const [users, setUsers] = useState(null); // State to hold user data
  const [exercises, setExercises] = useState(true);
  const [trainers, setTrainers] = useState(null);

  const fetchUsers = async () => {
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
  const fetchExercises = async () => {};
  const fetchTrainers = async () => {};

  useEffect(() => {
    fetchData();
  }, [params.id]);

  return (
    <StoreContext.Provider value={{ users, exercises, trainers }}>
      {children}
    </StoreContext.Provider>
  );
};

// Custom hook to use the User Context
export const useStore = () => useContext(StoreContext);
