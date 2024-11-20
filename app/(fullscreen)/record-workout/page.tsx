"use client";
import axios from "axios";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Spinner from "@/components/Spinner";
import WorkoutRecordHeader from "@/components/WorkoutRecordHeader";
import WorkoutRecordBody from "@/components/WorkoutRecordBody";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const RecordWorkout = () => {
    const searchParams = useSearchParams();

    // Extract the query parameters
    const clientId = searchParams.get("clientId");
    const phaseId = searchParams.get("phaseId");
    const sessionId = searchParams.get("sessionId");

    const [pageLoading, setPageLoading] = useState(true);
    const [openExercises, setOpenExercises] = useState([]);
    const [sessionInformation, setSessionInformation] = useState(null);
    const [exerciseData, setExerciseData] = useState([]);

    const toggleAccordion = (exId: string) => {
        setOpenExercises((prevOpenExercises) => {
            if (prevOpenExercises.includes(exId)) {
                return prevOpenExercises.filter((id) => id !== exId);
            } else {
                return [...prevOpenExercises, exId];
            }
        });
    };

    useEffect(() => {
        async function loadData() {
            setPageLoading(true);
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
    }, []);

    const handleSetChange = (exerciseId, setId, field, value) => {
        setExerciseData((prevRecords) =>
            prevRecords.map((exercise) =>
                exercise.id === exerciseId
                    ? {
                          ...exercise,
                          sets: exercise.sets.map((set) =>
                              set.id === setId
                                  ? { ...set, [field]: value }
                                  : set
                          ),
                      }
                    : exercise
            )
        );
    };

    const handleExerciseNotesChange = (exerciseId, value) => {
        setExerciseData((prevRecords) =>
            prevRecords.map((exercise) =>
                exercise.id === exerciseId
                    ? { ...exercise, notes: value }
                    : exercise
            )
        );
    };

    if (pageLoading) {
        return (
            <div className="bg-green-800">
                <Spinner />
            </div>
        );
    }

    return (
        <Suspense
            fallback={
                <div className="bg-green-800">
                    <Spinner />
                </div>
            }
        >
            <div className="min-h-screen bg-green-800 flex flex-col items-center">
                <div className="flex flex-col w-full max-w-full mx-auto">
                    <WorkoutRecordHeader
                        phaseName={sessionInformation["phases.phaseName"]}
                        sessionName={sessionInformation["sessionName"]}
                        startTime={""}
                    />

                    <WorkoutRecordBody
                        workoutRecords={exerciseData}
                        toggleAccordion={toggleAccordion}
                        openExercises={openExercises}
                        handleSetChange={handleSetChange}
                        handleExerciseNotesChange={handleExerciseNotesChange}
                    />
                </div>
            </div>
        </Suspense>
    );
};

export default RecordWorkout;
