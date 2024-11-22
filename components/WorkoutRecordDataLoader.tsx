'use client'; // Ensure this is a client-side component

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const SearchParamsLoader = ({ setClientId, setPhaseId, setSessionId, setSessionInformation, setExerciseData, setPageLoading }) => {
    const searchParams = useSearchParams();

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
            console.log(JSON.stringify(response.data, null, 2));

            const {
                recommendedWorkouts,
                sessionInfo,
                workoutId,
                trackWorkout,
            } = response.data;

            setExerciseData(trackWorkout);
            setSessionInformation(sessionInfo[0]);
            setPageLoading(false);
        }

        loadData();
    }, [searchParams, setClientId, setPhaseId, setSessionId, setSessionInformation, setExerciseData, setPageLoading]);

    return null;
};

export default SearchParamsLoader;