"use client";
import React, { Suspense, useState } from "react";
import Spinner from "@/components/Spinner";
import SearchParamsLoader from "@/components/WorkoutRecordDataLoader";
import WorkoutRecordHeader from "@/components/WorkoutRecordHeader";
import WorkoutRecordBody from "@/components/WorkoutRecordBody";
import { ID } from "appwrite";
import axios from "axios";
import { API_BASE_URL } from "@/configs/constants";

const RecordWorkout = () => {
    const [clientId, setClientId] = useState("");
    const [phaseId, setPhaseId] = useState("");
    const [sessionId, setSessionId] = useState("");
    const [workoutTrackId, setWorkoutTrackId] = useState("");

    const [pageLoading, setPageLoading] = useState(true);
    const [openExercises, setOpenExercises] = useState([]);
    const [sessionInformation, setSessionInformation] = useState(null);
    const [exerciseData, setExerciseData] = useState([]);
    const [savingState, setSavingState] = useState(false);

    const toggleAccordion = (exId: string) => {
        setOpenExercises((prevOpenExercises) => {
            if (prevOpenExercises.includes(exId)) {
                return prevOpenExercises.filter((id) => id !== exId);
            } else {
                return [...prevOpenExercises, exId];
            }
        });
    };

    const handleSetChange = (exerciseId, setId, field, value) => {
        const currentTime = new Date().toISOString();
        setExerciseData((prevRecords) =>
            prevRecords.map((exercise) =>
                exercise.id === exerciseId
                    ? {
                          ...exercise,
                          endTime: currentTime,
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
        const currentTime = new Date().toISOString();
        setExerciseData((prevRecords) =>
            prevRecords.map((exercise) =>
                exercise.id === exerciseId
                    ? { ...exercise, endTime: currentTime, notes: value }
                    : exercise
            )
        );
    };

    const saveToDatabase = async () => {
        try {
            setSavingState(true);
            await axios.post(
                `${API_BASE_URL}/mvmt/v1/client/workout-tracker`,
                { clientId, phaseId, sessionId, exerciseData, workoutTrackId },
                { withCredentials: true }
            );
        } catch (error) {
            console.error("Error saving workout data:", error);
        } finally {
            setSavingState(false);
        }
    };

    const handleAddSet = (exerciseId) => {
        const currentTime = new Date().toISOString();
        setExerciseData((prevExerciseData) =>
            prevExerciseData.map((exercise) => {
                if (exercise.id === exerciseId) {
                    const newSet = {
                        id: ID.unique(),
                        reps: 0,
                        weight: "",
                    };

                    return {
                        ...exercise,
                        endTime: currentTime,
                        sets: [...exercise.sets, newSet],
                    };
                }
                return exercise;
            })
        );
    };

    return (
        <Suspense
            fallback={
                <div className="bg-green-800">
                    <Spinner />
                </div>
            }
        >
            <SearchParamsLoader
                setClientId={setClientId}
                setPhaseId={setPhaseId}
                setSessionId={setSessionId}
                setWorkoutTrackId={setWorkoutTrackId}
                setSessionInformation={setSessionInformation}
                setExerciseData={setExerciseData}
                setPageLoading={setPageLoading}
            />
            {pageLoading ? (
                <div className="bg-green-800">
                    <Spinner />
                </div>
            ) : (
                <div className="min-h-screen bg-green-800 flex flex-col items-center">
                    <div className="flex flex-col w-full max-w-full mx-auto">
                        <WorkoutRecordHeader
                            phaseName={sessionInformation["phases.phaseName"]}
                            sessionName={sessionInformation["sessionName"]}
                            startTime={""}
                            savingState={savingState}
                            handleSave={saveToDatabase}
                        />

                        <WorkoutRecordBody
                            workoutRecords={exerciseData}
                            toggleAccordion={toggleAccordion}
                            openExercises={openExercises}
                            handleSetChange={handleSetChange}
                            handleExerciseNotesChange={
                                handleExerciseNotesChange
                            }
                            handleAddSet={handleAddSet}
                        />
                    </div>
                </div>
            )}
        </Suspense>
    );
};

export default RecordWorkout;
