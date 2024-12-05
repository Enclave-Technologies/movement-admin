"use client";
import { LIMIT } from "@/configs/constants";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
      `${API_BASE_URL}/mvmt/v1/trainer/clients?pageNo=1&limit=${LIMIT}`,
      {
        withCredentials: true, // Include cookies in the request
      }
    );
    setUsers(response.data);
  };

  const fetchExercises = async () => {
    const response = await axios.get(
      `${API_BASE_URL}/mvmt/v1/admin/exercises?limit=${LIMIT}`,
      {
        withCredentials: true,
      }
    );
    setExercises(response.data);
  };

  const fetchTrainers = async () => {
    const response = await axios.get(
      `${API_BASE_URL}/mvmt/v1/admin/trainerIds?limit=${LIMIT}`,
      {
        withCredentials: true, // Include cookies in the request
      }
    );
    setTrainers(response.data);
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
    fetchUsers();
    fetchExercises();
    fetchTrainers();
    fetchCounts();
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <StoreContext.Provider
      value={{ countDoc, users, exercises, trainers, reloadData }}
    >
      {children}
    </StoreContext.Provider>
  );
};

// Custom hook to use the User Context
export const useGlobalContext = () => useContext(StoreContext);
