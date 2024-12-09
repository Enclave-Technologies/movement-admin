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

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const WorkoutPlan = ({
    pageLoading,
    setPageLoading,
    client_id,
    workouts,
    clientPhases,
    setClientPhases,
    nextSession,
    progressId,
    setShowToast,
    setToastMessage,
    setToastType,
}) => {
    const { userData } = useUser();
    const [editingExerciseId, setEditingExerciseId] = useState(null);

    const handleAddPhase = async () => {
        // Logic to add a new phase
        const newPhase: Phase = {
            phaseId: ID.unique(),
            phaseName: "Untitled Phase",
            isActive: false,
            sessions: [],
        };

        const modifiedClientPhases = [...clientPhases, newPhase];

        setClientPhases(modifiedClientPhases);
        const data: DataResponse = {
            phases: modifiedClientPhases,
        };
        await axios.post(
            `${API_BASE_URL}/mvmt/v1/client/phases`,
            {
                client_id: client_id,
                data,
            },
            { withCredentials: true }
        );
    };

    const handleCopyPhase = async (phaseId: string) => {
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

        const modifiedClientPhases = [...clientPhases, newPhase];
        setClientPhases(modifiedClientPhases);
        const data: DataResponse = {
            phases: modifiedClientPhases,
        };
        await axios.post(
            `${API_BASE_URL}/mvmt/v1/client/phases`,
            {
                client_id: client_id,
                data,
            },
            { withCredentials: true }
        );
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
                    client_id: client_id,
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

    const handleActivatePhase = async (
        phaseId: string,
        phaseState: boolean
    ) => {
        const modifiedPhases = clientPhases.map((phase) => ({
            ...phase,
            isActive: phase.phaseId === phaseId ? phaseState : false,
        }));
        setClientPhases(modifiedPhases);
        const data: DataResponse = {
            phases: modifiedPhases,
        };
        await axios.post(
            `${API_BASE_URL}/mvmt/v1/client/phases`,
            {
                client_id: client_id,
                data,
            },
            { withCredentials: true }
        );
    };

    const handlePhaseNameChange = async (
        phaseId: string,
        newPhaseName: string
    ) => {
        // Update the phase name in the original data
        const updatedPhases = clientPhases.map((p) =>
            p.phaseId === phaseId ? { ...p, phaseName: newPhaseName } : p
        );
        setClientPhases(updatedPhases);
        const data: DataResponse = {
            phases: updatedPhases,
        };
        await axios.post(
            `${API_BASE_URL}/mvmt/v1/client/phases`,
            {
                client_id: client_id,
                data,
            },
            { withCredentials: true }
        );
    };

    const onAddSession = async (
        phaseId: string,
        newSession: MovementSession
    ) => {
        const updatedPhases = clientPhases.map((p) =>
            p.phaseId === phaseId
                ? { ...p, sessions: [...p.sessions, newSession] }
                : p
        );

        setClientPhases(updatedPhases);
        const data: DataResponse = {
            phases: updatedPhases,
        };
        await axios.post(
            `${API_BASE_URL}/mvmt/v1/client/phases`,
            {
                client_id: client_id,
                data,
            },
            { withCredentials: true }
        );
    };

    const handleSessionNameChange = async (
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
        const data: DataResponse = {
            phases: updatedPhases,
        };
        await axios.post(
            `${API_BASE_URL}/mvmt/v1/client/phases`,
            {
                client_id: client_id,
                data,
            },
            { withCredentials: true }
        );
    };

    const handleSessionDelete = async (sessionId: string) => {
        // Remove the session from the original data
        const updatedPhases = clientPhases.map((phase) => ({
            ...phase,
            sessions: phase.sessions.filter((s) => s.sessionId !== sessionId),
        }));
        setClientPhases(updatedPhases);
        const data: DataResponse = {
            phases: updatedPhases,
        };
        await axios.post(
            `${API_BASE_URL}/mvmt/v1/client/phases`,
            {
                client_id: client_id,
                data,
            },
            { withCredentials: true }
        );
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
                                            fullName: "",
                                            motion: "",
                                            targetArea: "",
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
                                            bias: "",
                                            lenShort: "",
                                            impliment: "",
                                            grip: "",
                                            angle: "",
                                            support: "",
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

    async function handleExerciseSave() {
        const data: DataResponse = {
            phases: clientPhases,
        };
        await axios.post(
            `${API_BASE_URL}/mvmt/v1/client/phases`,
            {
                client_id: client_id,
                data,
            },
            { withCredentials: true }
        );
    }

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

    const handlePhaseDelete = async (phaseId: string) => {
        const updatedPhases = clientPhases.filter(
            (phase) => phase.phaseId !== phaseId
        );
        setClientPhases(updatedPhases);
        const data: DataResponse = {
            phases: updatedPhases,
        };
        await axios.post(
            `${API_BASE_URL}/mvmt/v1/client/phases`,
            {
                client_id: client_id,
                data,
            },
            { withCredentials: true }
        );
    };

    if (pageLoading) {
        return (
            <div className="">
                <BreadcrumbLoading />
            </div>
        );
    }

    return (
        <div className="">
            <div className="flex justify-between">
                <button
                    className="text-sm flex items-center justify-center px-4 secondary-btn uppercase gap-2 bg-green-500 text-white"
                    onClick={handleAddPhase}
                >
                    <FaPlus />
                    Add Phase
                </button>
            </div>
            {/* <DemoTable exercises={workouts} /> */}
            <div className="mt-4">
                <div className="w-full space-y-4">
                    {clientPhases?.length === 0 ? (
                        <div className="text-center py-4 px-6 bg-gray-100 rounded-md shadow-sm">
                            <p className="text-gray-500 text-sm font-medium uppercase">
                                No phases added yet
                            </p>
                            <p className="text-gray-400 text-xs mt-1 uppercase">
                                Click &ldquo;Add Phase&rdquo; to get started
                            </p>
                        </div>
                    ) : (
                        clientPhases?.map((phase) => (
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
                                handleExerciseSave={handleExerciseSave}
                                onExerciseOrderChange={
                                    handleExerciseOrderChange
                                }
                                onEditExercise={handleEditExercise}
                                onCancelEdit={handleCancelEdit}
                                client_id={client_id}
                                nextSession={nextSession}
                                progressId={progressId}
                                setShowToast={setShowToast}
                                setToastMessage={setToastMessage}
                                setToastType={setToastType}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkoutPlan;
