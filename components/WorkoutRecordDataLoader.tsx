"use client"; // Ensure this is a client-side component

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { ID } from "appwrite";
import { API_BASE_URL } from "@/configs/constants";
const SearchParamsLoader = ({
    setClientId,
    setPhaseId,
    setSessionId,
    setWorkoutTrackId,
    setSessionInformation,
    setExerciseData,
    setPageLoading,
    exerciseData,
    sessionInformation,
    workoutTrackId,
    pageLoading,
    onSave,
}) => {
    const searchParams = useSearchParams();
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        async function loadData() {
            setPageLoading(true);
            // Extract the query parameters
            const clientId = searchParams.get("clientId");
            const phaseId = searchParams.get("phaseId");
            const sessionId = searchParams.get("sessionId");

            setClientId(clientId);
            setPhaseId(phaseId);
            setSessionId(sessionId);

            const response = await axios.get(
                `${API_BASE_URL}/mvmt/v1/client/workout-tracker?client_id=${clientId}&phase_id=${phaseId}&session_id=${sessionId}`,
                { withCredentials: true }
            );
            // console.log(JSON.stringify(response.data, null, 2));

            const {
                // recommendedWorkouts,
                sessionInfo,
                // workoutId,
                trackWorkout,
            } = response.data;

            setExerciseData(trackWorkout);
            setSessionInformation(sessionInfo[0]);
            setWorkoutTrackId(ID.unique());
            setPageLoading(false);
        }

        loadData();
    }, [
        searchParams,
        setClientId,
        setPhaseId,
        setSessionId,
        setWorkoutTrackId,
        setSessionInformation,
        setExerciseData,
        setPageLoading,
    ]);

    // useEffect(() => {
    //     if (
    //         !dataLoaded &&
    //         exerciseData &&
    //         sessionInformation &&
    //         workoutTrackId &&
    //         !pageLoading
    //     ) {
    //         alert(`Saving data: ${JSON.stringify(exerciseData, null, 2)}`);
    //         onSave();
    //         setDataLoaded(true);
    //     }
    // }, [
    //     exerciseData,
    //     sessionInformation,
    //     workoutTrackId,
    //     pageLoading,
    //     dataLoaded,
    //     onSave,
    // ]);

    return null;
};

export default SearchParamsLoader;
