import { useEffect, useState } from "react";
import axios from "axios";

const useFetchWorkouts = () => {
    const [allWorkouts, setAllWorkouts] = useState([]);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/mvmt/v1/trainer/workouts`,
                    { withCredentials: true }
                );
                setAllWorkouts(response.data);
            } catch (error) {
                console.error("Error fetching workouts:", error);
            }
        };
        fetchWorkouts();
    }, []);

    return allWorkouts;
};

export default useFetchWorkouts;
