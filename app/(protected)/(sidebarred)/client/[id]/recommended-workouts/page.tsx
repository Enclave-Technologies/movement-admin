"use client";
import Breadcrumb from "@/components/Breadcrumb";
import React, { useEffect, useState } from "react";
import { ID } from "appwrite";
import { useUser } from "@/context/ClientContext";
import axios from "axios";
import BreadcrumbLoading from "@/components/BreadcrumbLoading";
import Spinner from "@/components/Spinner";
import PhaseComponent from "@/components/PhaseComponent";
import { FaPlus, FaSave } from "react-icons/fa";
import DemoTable from "@/components/DemoTable";
import { API_BASE_URL } from "@/configs/constants";
const Page = ({ params }: { params: { id: string } }) => {
    const { userData } = useUser();
    const page_title = ["Workout Plan"];
    const [clientPhases, setClientPhases] = useState<Phase[]>();
    const [workouts, setWorkouts] = useState<WorkoutData[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [editingExerciseId, setEditingExerciseId] = useState(null);

    useEffect(() => {
        async function loadData() {
            setPageLoading(true);
            try {
                const clientPhases = await axios.get(
                    `${API_BASE_URL}/mvmt/v1/client/phases?client_id=${params.id}`,
                    { withCredentials: true }
                );
                const workouts = await axios.get(
                    `${API_BASE_URL}/mvmt/v1/trainer/workouts`,
                    { withCredentials: true }
                );
                setClientPhases(clientPhases.data.phases);
                setWorkouts(workouts.data);
            } catch (error) {
                console.error(error);
            } finally {
                setPageLoading(false);
            }
        }
        loadData();
    }, []);

    const handleAddPhase = () => {
        // Logic to add a new phase
        const newPhase: Phase = {
            phaseId: ID.unique(),
            phaseName: "New Phase",
            isActive: false,
            sessions: [],
        };
        setClientPhases([...clientPhases, newPhase]);
    };

    const handleCopyPhase = (phaseId: string) => {
        // Find the target phase to be copied
        const targetPhase = clientPhases.find(
            (phase) => phase.phaseId === phaseId
        );
        if (!targetPhase) return;

        // Create a new phase with a unique ID
        const newPhase: Phase = {
            phaseId: ID.unique(),
            phaseName: `${targetPhase.phaseName} (Copy)`,
            isActive: false,
            sessions: targetPhase.sessions.map((session) => ({
                sessionId: ID.unique(),
                sessionName: `${session.sessionName} (Copy)`,
                exercises: session.exercises.map((exercise) => ({
                    id: ID.unique(),
                    exerciseId: exercise.exerciseId,
                    exerciseDescription: exercise.exerciseDescription,
                    exerciseMotion: exercise.exerciseMotion,
                    exerciseShortDescription: exercise.exerciseShortDescription,
                    exerciseVideo: exercise.exerciseVideo,
                    repsMin: exercise.repsMin,
                    repsMax: exercise.repsMax,
                    setsMin: exercise.setsMin,
                    setsMax: exercise.setsMax,
                    tempo: exercise.tempo,
                    TUT: exercise.TUT,
                    restMin: exercise.restMin,
                    restMax: exercise.restMax,
                    exerciseOrder: exercise.exerciseOrder,
                    setOrderMarker: exercise.setOrderMarker,
                })),
                sessionTime: session.sessionTime,
                sessionOrder: session.sessionOrder,
            })),
        };

        setClientPhases([...clientPhases, newPhase]);
        console.log("Copying phase...");
    };

    const handleDataSubmit = async () => {
        try {
            setPageLoading(true);
            const data: DataResponse = {
                phases: clientPhases,
            };
            const response = await axios.post(
                `${API_BASE_URL}/mvmt/v1/client/phases`,
                {
                    client_id: params.id,
                    data,
                },
                { withCredentials: true }
            );
            console.log(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setPageLoading(false);
        }
    };

    const handleActivatePhase = (phaseId: string, phaseState: boolean) => {
        setClientPhases((prevPhases) =>
            prevPhases.map((phase) => ({
                ...phase,
                isActive: phase.phaseId === phaseId ? phaseState : false,
            }))
        );
    };

    const handlePhaseNameChange = (phaseId: string, newPhaseName: string) => {
        // Update the phase name in the original data
        const updatedPhases = clientPhases.map((p) =>
            p.phaseId === phaseId ? { ...p, phaseName: newPhaseName } : p
        );
        setClientPhases(updatedPhases);
    };

    const onAddSession = (phaseId: string, newSession: MovementSession) => {
        const updatedPhases = clientPhases.map((p) =>
            p.phaseId === phaseId
                ? { ...p, sessions: [...p.sessions, newSession] }
                : p
        );
        setClientPhases(updatedPhases);
    };

    const handleSessionNameChange = (
        sessionId: string,
        newSessionName: string
    ) => {
        // Update the session name in the original data
        const updatedPhases = clientPhases.map((phase) => ({
            ...phase,
            sessions: phase.sessions.map((s) =>
                s.sessionId === sessionId
                    ? { ...s, sessionName: newSessionName }
                    : s
            ),
        }));
        setClientPhases(updatedPhases);
    };

    const handleSessionDelete = (sessionId: string) => {
        // Remove the session from the original data
        const updatedPhases = clientPhases.map((phase) => ({
            ...phase,
            sessions: phase.sessions.filter((s) => s.sessionId !== sessionId),
        }));
        setClientPhases(updatedPhases);
    };

    const handleExerciseAdd = (phaseId: string, sessionId: string) => {
        // Update the original data with the new exercise
        const updatedPhases = clientPhases.map((phase) =>
            phase.phaseId === phaseId
                ? {
                      ...phase,
                      sessions: phase.sessions.map((session) =>
                          session.sessionId === sessionId
                              ? {
                                    ...session,
                                    exercises: [
                                        ...session.exercises,
                                        {
                                            id: ID.unique(),
                                            exerciseId: "",
                                            exerciseDescription: "",
                                            exerciseMotion: "",
                                            exerciseShortDescription: "",
                                            exerciseVideo: "",
                                            repsMin: 0,
                                            repsMax: 0,
                                            setsMin: 0,
                                            setsMax: 0,
                                            tempo: "",
                                            TUT: 0,
                                            restMin: 0,
                                            restMax: 0,
                                            exerciseOrder:
                                                session.exercises.length + 1, // Set the order to the current length + 1
                                            setOrderMarker: "",
                                        },
                                    ],
                                }
                              : session
                      ),
                  }
                : phase
        );
        setClientPhases(updatedPhases);
    };

    const handleExerciseUpdate = (
        phaseId: string,
        sessionId: string,
        updatedExercise: Exercise
    ) => {
        // Update the exercise in the specific session and phase
        const updatedPhases = clientPhases.map((phase) =>
            phase.phaseId === phaseId
                ? {
                      ...phase,
                      sessions: phase.sessions.map((session) =>
                          session.sessionId === sessionId
                              ? {
                                    ...session,
                                    exercises: session.exercises.map((e) =>
                                        e.id === updatedExercise.id
                                            ? updatedExercise
                                            : e
                                    ),
                                }
                              : session
                      ),
                  }
                : phase
        );
        setClientPhases(updatedPhases);
    };
    const handleEditExercise = (exerciseId) => {
        setEditingExerciseId(exerciseId);
    };

    const handleCancelEdit = () => {
        setEditingExerciseId(null);
    };
    const handleExerciseDelete = (
        phaseId: string,
        sessionId: string,
        exerciseId: string
    ) => {
        // Remove the exercise from the specific session and phase
        const updatedPhases = clientPhases.map((phase) =>
            phase.phaseId === phaseId
                ? {
                      ...phase,
                      sessions: phase.sessions.map((session) =>
                          session.sessionId === sessionId
                              ? {
                                    ...session,
                                    exercises: session.exercises.filter(
                                        (e) => e.id !== exerciseId
                                    ),
                                }
                              : session
                      ),
                  }
                : phase
        );
        setClientPhases(updatedPhases);
    };

    const handleExerciseOrderChange = (
        phaseId: string,
        sessionId: string,
        updatedExercises: Exercise[]
    ) => {
        // Update the exercise order in the specific session and phase
        const updatedPhases = clientPhases.map((phase) =>
            phase.phaseId === phaseId
                ? {
                      ...phase,
                      sessions: phase.sessions.map((session) =>
                          session.sessionId === sessionId
                              ? {
                                    ...session,
                                    exercises: updatedExercises.map(
                                        (exercise, index) => ({
                                            ...exercise,
                                            exerciseOrder: index + 1, // Update exerciseOrder to be 1-based index
                                        })
                                    ),
                                }
                              : session
                      ),
                  }
                : phase
        );
        setClientPhases(updatedPhases);
    };

    const handlePhaseDelete = (phaseId: string) => {
        const updatedPhases = clientPhases.filter(
            (phase) => phase.phaseId !== phaseId
        );
        setClientPhases(updatedPhases);
    };

    if (pageLoading) {
        return (
            <div className="ml-12">
                <BreadcrumbLoading />
                <Spinner />
            </div>
        );
    }
    return (
        <div className="uppercase ">
            <div className="ml-12 flex justify-between">
                <Breadcrumb
                    homeImage={userData?.imageUrl}
                    homeTitle={userData?.name}
                    customTexts={page_title}
                />

                {/* <button className="bg-green-500 hover:bg-green-900 text-white px-5 py-1 h-12 rounded-md transition-colors duration-300">
                    Save
                </button> */}
            </div>
            {/* <DemoTable exercises={workouts} /> */}
            <div className="mt-12">
                <div className="w-full space-y-4">
                    {clientPhases.length === 0 ? (
                        <div className="text-center py-4 px-6 bg-gray-100 rounded-md shadow-sm">
                            <p className="text-gray-500 text-sm font-medium uppercase">
                                No phases added yet
                            </p>
                            <p className="text-gray-400 text-xs mt-1 uppercase">
                                Click &ldquo;Add Phase&rdquo; to get started
                            </p>
                        </div>
                    ) : (
                        clientPhases.map((phase) => (
                            <PhaseComponent
                                key={phase.phaseId}
                                phase={phase}
                                workouts={workouts}
                                handleCopyPhase={handleCopyPhase}
                                onPhaseNameChange={handlePhaseNameChange}
                                onPhaseDelete={handlePhaseDelete}
                                onActivatePhase={handleActivatePhase}
                                onAddSession={onAddSession}
                                activePhaseId={
                                    clientPhases.find((p) => p.isActive)
                                        ?.phaseId || null
                                }
                                onSessionDelete={handleSessionDelete}
                                onSessionNameChange={handleSessionNameChange}
                                editingExerciseId={editingExerciseId}
                                onExerciseAdd={handleExerciseAdd}
                                onExerciseUpdate={handleExerciseUpdate}
                                onExerciseDelete={handleExerciseDelete}
                                onExerciseOrderChange={
                                    handleExerciseOrderChange
                                }
                                onEditExercise={handleEditExercise}
                                onCancelEdit={handleCancelEdit}
                            />
                        ))
                    )}
                </div>
            </div>
            <button
                className="flex items-center justify-center w-full mt-4 px-4 py-2 secondary-btn uppercase gap-5"
                onClick={handleAddPhase}
            >
                <FaPlus className="text-lg" />
                Add Phase
            </button>
            {/* <pre>{JSON.stringify(clientPhases, null, 2)}</pre> */}
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    className="bg-green-500/75 hover:bg-green-500/100 text-white p-4 rounded-full shadow-md transition-colors duration-300 touchscreen-button"
                    onClick={handleDataSubmit}
                >
                    <FaSave className="text-5xl" />
                </button>
            </div>
        </div>
    );
};

export default Page;
