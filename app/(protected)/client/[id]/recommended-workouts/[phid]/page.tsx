"use client";
import Breadcrumb from "@/components/Breadcrumb";
import EditableRow from "@/components/EditableRow";
import { useUser } from "@/context/ClientContext";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const Page = ({ params }: { params: { id: string; phid: string } }) => {
    const { userData, setUserData } = useUser();
    const [pageLoading, setPageLoading] = useState(true);
    const [selectedPhase, setSelectedPhase] = useState<Phase>(null);
    const page_title = [
        "Training Program",
        selectedPhase ? selectedPhase.phaseName : "Untitled Phase",
    ];
    const [sessionDropdownOptions, setSessionDropdownOptions] = useState<
        MovSessionDropdownOption[]
    >([]);
    const [exerciseList, setExerciseList] = useState<SessionExercise[]>([]);
    const [activeExerciseList, setActiveExerciseList] = useState<
        SessionExercise[]
    >([]);
    const [allWorkouts, setAllWorkouts] = useState<WorkoutData[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/mvmt/v1/trainer/client?client_id=${params.id}`,
                    { withCredentials: true }
                );
                if (isMounted) {
                    setUserData(response.data);
                    setPageLoading(false); // Set loading to false after data is fetched
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                if (isMounted) {
                    setPageLoading(false); // Set loading to false in case of error
                }
            }
        };

        const fetchAllData = async () => {
            // TODO: DB CONNECTION
            const retrievedPhase = {
                id: "phase1",
                phaseName: "Phase 1",
                isActive: true,
                sessions: [
                    {
                        id: "upper1",
                        sessionName: "Session 1: Upper Body",
                        phases: "phase1",
                        sessionOrder: 1,
                        exercises: [
                            {
                                id: "sessEx1",
                                exerciseOrder: 1,
                                exercises: "ex1",
                                motion: "UPPER BODY PUSH",
                                specificDescription:
                                    "DUMBBELL FLAT BENCH PRESS",
                                repsMax: 10,
                                repsMin: 8,
                                setsMax: 5,
                                setsMin: 3,
                                sessions: "upper1",
                            },
                            {
                                id: "sessEx2",
                                exerciseOrder: 2,
                                exercises: "ex2",
                                motion: "UPPER BODY PULL",
                                specificDescription: "WIDE GRIP LAT PULL DOWN",
                                repsMax: 10,
                                repsMin: 8,
                                setsMax: 5,
                                setsMin: 3,
                                sessions: "upper1",
                            },
                        ],
                    },
                    {
                        id: "lower1",
                        sessionName: "Session 2: Lower Body",
                        phases: "phase1",
                        sessionOrder: 1,
                        exercises: [],
                    },
                ],
            };

            let DropdownData: MovSessionDropdownOption[] = [];
            let exerciseListData: any[] = [];
            let activeExercises: any[] = [];

            // Check if any sessions exist within the phases
            const hasSessions = retrievedPhase.sessions.length > 0;

            if (!hasSessions) {
                // If no sessions exist, show "No Sessions" option in the second dropdown
                DropdownData = [
                    {
                        value: "no-sessions",
                        label: "No Sessions, Please Add",
                        phaseId: "",
                    },
                ];
                // Exercise list should also be empty
                exerciseListData = [];
                activeExercises = [];
            } else {
                // Map sessions to dropdown options
                const allSessionsData = mapSessionsToDropdownOptions([
                    retrievedPhase,
                ]);
                const filteredSessions = allSessionsData.filter(
                    (session) => session.phaseId === retrievedPhase.id
                );

                // Check if filteredSessions is empty
                if (filteredSessions.length === 0) {
                    DropdownData = [
                        {
                            value: "no-sessions",
                            label: "No Sessions, Please Add",
                            phaseId: "",
                        },
                    ];
                } else {
                    DropdownData = filteredSessions;
                }

                // Check if any exercises exist within the sessions
                const hasExercises = retrievedPhase.sessions.some(
                    (session: MovSession) => session.exercises.length > 0
                );
                if (!hasExercises) {
                    // If no exercises exist, exercise list should be empty
                    exerciseListData = [];
                    activeExercises = [];
                } else {
                    // Map exercises to the exercise list
                    exerciseListData = mapExercisesToList([retrievedPhase]);

                    // Check if secondDropdownData[0].value is "no-sessions"
                    if (
                        DropdownData[0] &&
                        DropdownData[0].value === "no-sessions"
                    ) {
                        activeExercises = [];
                    } else {
                        // Filter exercises from exerciseListData whose sessions === secondDropdownData[0].value
                        const filteredExercises = exerciseListData.filter(
                            (exercise) =>
                                exercise.sessions === DropdownData[0].value
                        );
                        activeExercises = filteredExercises;
                    }
                }
            }

            setSelectedPhase(retrievedPhase);
            setSessionDropdownOptions(DropdownData);
            setExerciseList(exerciseListData);
            setActiveExerciseList(activeExercises);
        };

        const getAllWorkouts = async () => {
            try {
                // TODO: DB CONNECTION
                const response = await axios.get(
                    `${API_BASE_URL}/mvmt/v1/trainer/workouts`,

                    { withCredentials: true }
                );
                const allExercises: WorkoutData[] = response.data;
                setAllWorkouts(allExercises);
            } catch (error) {
                console.log(error);
            }
        };

        setPageLoading(true); // Set loading to true before fetching data

        if (!userData) {
            fetchData();
            fetchAllData();
            getAllWorkouts();
        } else {
            fetchAllData();
            getAllWorkouts();
            setPageLoading(false); // Set loading to false if userData is already available
        }

        return () => {
            isMounted = false; // Cleanup function to prevent state updates on unmounted components
        };
    }, [params.id, setUserData, userData]);

    const handleSessionChange = (selectedSessionId: string) => {
        const exercises = exerciseList.filter(
            (exer) => exer.sessions === selectedSessionId
        );

        setActiveExerciseList(exercises);
    };
    const mapSessionsToDropdownOptions = (
        phases: Phase[]
    ): MovSessionDropdownOption[] => {
        return phases.flatMap((phase: Phase) =>
            phase.sessions.map((session: MovSession) => ({
                value: session.id,
                label: session.sessionName,
                phaseId: phase.id,
            }))
        );
    };

    const handleActivatePhase = (phaseId: string) => {
        console.log(phaseId);
    };
    const mapExercisesToList = (phases: Phase[]): SessionExercise[] => {
        return phases.flatMap((phase: Phase) =>
            phase.sessions.flatMap((session: MovSession) => session.exercises)
        );
    };
    const handleAddExercise = () => {
        const firstWorkout = allWorkouts[0];
        setActiveExerciseList([
            ...activeExerciseList,
            {
                exerciseOrder: activeExerciseList.length + 1,
                motion: firstWorkout.Motion,
                specificDescription: firstWorkout.SpecificDescription,
                repsMin: firstWorkout.RecommendedRepsMin,
                repsMax: firstWorkout.RecommendedRepsMax,
                setsMin: firstWorkout.RecommendedSetsMin,
                setsMax: firstWorkout.RecommendedSetsMax,
                exercises: firstWorkout.id,
                id: "",
                sessions: "",
                restMax: firstWorkout.RecommendedRestMax,
                restMin: firstWorkout.RecommendedRestMin,
                tempo: firstWorkout.Tempo,
                TUT: firstWorkout.TUT,
            },
        ]);
        setIsEditing(true);
    };
    return pageLoading ? (
        <div>Loading...</div>
    ) : (
        <div>
            <Breadcrumb
                homeImage={userData?.imageUrl}
                homeTitle={userData?.name}
                customTexts={page_title}
            />

            <div className="flex flex-col w-1/4">
                <div className="flex w-1/2 items-center justify-between">
                    <select
                        className="border rounded p-2"
                        onChange={(e) => handleSessionChange(e.target.value)}
                    >
                        {sessionDropdownOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="flex flex-col text-center items-center ml-5">
                        {selectedPhase && selectedPhase.isActive && (
                            <div className="bg-green-500 text-white px-2 py-1 w-16 h-8 rounded-full text-sm font-semibold">
                                Active
                            </div>
                        )}
                        {selectedPhase && !selectedPhase.isActive && (
                            <>
                                <button
                                    className="bg-gold-500 text-white px-4 py-2 rounded hover:bg-green-500 mt-2"
                                    onClick={() =>
                                        handleActivatePhase(selectedPhase.id)
                                    }
                                >
                                    Activate Phase
                                </button>
                                <div className="h-10"></div>
                            </>
                        )}
                    </div>
                </div>

                {/* Move links down */}
                <div className="flex items-center justify-between space-x-2 mt-2">
                    <Link
                        href={
                            selectedPhase.id
                                ? `/client/${params.id}/recommended-workouts/${
                                      selectedPhase.id
                                  }/new-session?phaseTitle=${encodeURIComponent(
                                      selectedPhase.phaseName || ""
                                  )}&phaseId=${encodeURIComponent(
                                      selectedPhase.id
                                  )}`
                                : "#"
                        }
                        className="text-blue-500 hover:underline"
                    >
                        Add
                    </Link>
                    <Link href="#" className="text-blue-500 hover:underline">
                        Delete
                    </Link>
                </div>
            </div>

            {/* Table Component */}
            {activeExerciseList.length === 0 ? (
                <p className="text-gray-600 w-full text-center">
                    No Exercises added to this session yet.
                    <br />
                    Click on <strong>+ Add Exercise</strong> to add a new
                    exercise.
                </p>
            ) : (
                <table className="w-full mt-4 border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="bg-green-500 text-white border border-gray-300 p-2">
                                Order
                            </th>
                            <th className="bg-green-500 text-white border border-gray-300 p-2">
                                Motion
                            </th>
                            <th className="bg-green-500 text-white border border-gray-300 p-2">
                                Specific Description
                            </th>
                            <th className="bg-green-500 text-white border border-gray-300 p-2">
                                Reps Min
                            </th>
                            <th className="bg-green-500 text-white border border-gray-300 p-2">
                                Reps Max
                            </th>
                            <th className="bg-green-500 text-white border border-gray-300 p-2">
                                Sets Min
                            </th>
                            <th className="bg-green-500 text-white border border-gray-300 p-2">
                                Sets Max
                            </th>
                            <th className="bg-green-500 text-white border border-gray-300 p-2">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {activeExerciseList.map((exercise, index) => (
                            <EditableRow
                                key={index}
                                rowData={exercise}
                                onSave={(editedData) => {
                                    // Handle save logic
                                    const updatedExerciseList = [
                                        ...activeExerciseList,
                                    ];
                                    updatedExerciseList[index] = editedData;
                                    setActiveExerciseList(updatedExerciseList);
                                }}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                                allWorkouts={allWorkouts}
                            />
                        ))}
                    </tbody>
                </table>
            )}
            {/* Button Component */}
            <button
                onClick={handleAddExercise}
                className="w-full mt-4 p-2 border-2 rounded"
            >
                + Add Exercise
            </button>
        </div>
    );
};

export default Page;
