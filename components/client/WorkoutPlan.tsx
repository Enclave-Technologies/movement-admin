"use client";
import React, { useState } from "react";
import { ID } from "appwrite";
import { useUser } from "@/context/ClientContext";
import axios from "axios";
import BreadcrumbLoading from "@/components/BreadcrumbLoading";
import PhaseComponent from "@/components/PhaseComponent";
import { FaPlus } from "react-icons/fa";
import { API_BASE_URL } from "@/configs/constants";
import LoadingSpinner from "../LoadingSpinner";
import { updateSession } from "@/server_functions/session";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const WorkoutPlan = ({
  pageLoading,
  setPageLoading,
  fetchTrackedWorkouts,
  client_id,
  workouts,
  clientPhases,
  setClientPhases,
  nextSession,
  progressId,
  setShowToast,
  setToastMessage,
  setToastType,
  setHasUnsavedChanges,
}) => {
  // TODO: Autosave every 2 minutes on this page. Keep a track of what was sent to the backend for saving, and the clientPhases
  const { userData } = useUser();
  const [editingExerciseId, setEditingExerciseId] = useState(null);
  const [phaseActivation, setPhaseActivation] = useState(false);
  const [currentPhaseState, setCurrentPhaseState] = useState(false);
  const [phaseAddingState, setPhaseAddingState] = useState(false);
  const [opRunning, setOpRunning] = useState(false);
  const [savingState, setSavingState] = useState(false);
  // const [sessionAddingButtonState, setSessionAddingButtonState] =
  //     useState(false);
  // const [sessionButtonsState, setSessionButtonsState] = useState(false);

  const handleAddPhase = async () => {
    setOpRunning(true);
    try {
      setPhaseAddingState(true);
      // Logic to add a new phase
      const newPhase: Phase = {
        phaseId: ID.unique(),
        phaseName: "Untitled Phase",
        isActive: false,
        sessions: [],
      };

      const modifiedClientPhases = [...clientPhases, newPhase];

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
      setToastMessage("Phase data successfully saved!");
      setToastType("success");
      setShowToast(true);

      setClientPhases(modifiedClientPhases);
    } finally {
      setPhaseAddingState(false);
      setOpRunning(false);
    }
  };

  const handleCopyPhase = async (phaseId: string) => {
    setOpRunning(true);
    try {
      setPhaseAddingState(true);
      setSavingState(true);
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
          exercises: session.exercises.map((exercise: Exercise) => ({
            id: ID.unique(),
            exerciseId: exercise.exerciseId,
            fullName: exercise.fullName,
            motion: exercise.motion,
            targetArea: exercise.targetArea,
            exerciseVideo: exercise.exerciseVideo || "",
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
            bias: exercise.bias,
            lenShort: exercise.lenShort,
            impliment: exercise.impliment,
            grip: exercise.grip,
            angle: exercise.angle,
            support: exercise.support,
            xtraInstructions: exercise.xtraInstructions,
          })),
          sessionTime: session.sessionTime,
          sessionOrder: session.sessionOrder,
        })),
      };

      const modifiedClientPhases = [...clientPhases, newPhase];
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
      setToastMessage("Phase data copied successfully!");
      setToastType("success");
      setShowToast(true);
      setClientPhases(modifiedClientPhases);
    } finally {
      setPhaseAddingState(false);
      setSavingState(false);
      setOpRunning(false);
    }
  };

  const handleActivatePhase = async (phaseId: string, phaseState: boolean) => {
    setOpRunning(true);
    try {
      setCurrentPhaseState(phaseState);
      setPhaseActivation(true);
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
      if (phaseState) {
        setToastMessage("Phase activation successful!");
      } else {
        setToastMessage("Phase deactivation successful!");
      }
      setToastType("success");
      setShowToast(true);

      fetchTrackedWorkouts();
    } finally {
      setPhaseActivation(false);
      setOpRunning(false);
    }
  };

  const handlePhaseNameChange = async (
    phaseId: string,
    newPhaseName: string
  ) => {
    setOpRunning(true);
    try {
      // if (!phaseButtonsState.includes(phaseId)) {
      //     setPhaseButtonsState([...phaseButtonsState, phaseId]);
      // }
      setSavingState(true);
      // Update the phase name in the original data
      const updatedPhases = clientPhases.map((p) =>
        p.phaseId === phaseId ? { ...p, phaseName: newPhaseName } : p
      );
      const data: DataResponse = {
        phases: updatedPhases,
      };
      try {
        await axios.post(
          `${API_BASE_URL}/mvmt/v1/client/phases`,
          {
            client_id: client_id,
            data,
          },
          { withCredentials: true }
        );
        setToastMessage("Phase name changed!");
        setToastType("success");
        setShowToast(true);
        setClientPhases(updatedPhases);
      } catch (e) {
        console.error("Failed to update phase name:", e);
        return false;
      }
      // setPhaseButtonsState(phaseButtonsState.filter((id) => id !== phaseId));
      return true;
    } finally {
      setSavingState(false);
      setOpRunning(false);
    }
  };

  const onAddSession = async (phaseId: string, newSession: MovementSession) => {
    setOpRunning(true);
    try {
      setSavingState(true);
      const updatedPhases = clientPhases.map((p) =>
        p.phaseId === phaseId
          ? { ...p, sessions: [...p.sessions, newSession] }
          : p
      );
      const data: DataResponse = {
        phases: updatedPhases,
      };
      setClientPhases(updatedPhases);
      await axios.post(
        `${API_BASE_URL}/mvmt/v1/client/phases`,
        {
          client_id: client_id,
          data,
        },
        { withCredentials: true }
      );
      setToastMessage("Session added successfully!");
      setToastType("success");
      setShowToast(true);
      setClientPhases(updatedPhases);
    } finally {
      setSavingState(false);
      setOpRunning(false);
    }
  };

  const handleSessionNameChange = async (
    sessionId: string,
    newSessionName: string
  ) => {
    setOpRunning(true);
    try {
      setSavingState(true);
      const updatedPhases = clientPhases.map((phase) => ({
        ...phase,
        sessions: phase.sessions.map((s) =>
          s.sessionId === sessionId ? { ...s, sessionName: newSessionName } : s
        ),
      }));
      const data: any = {
        sessionId: sessionId,
        sessionName: newSessionName,
      };
      await updateSession(client_id, data);
      setToastMessage("Session name changed!");
      setToastType("success");
      setShowToast(true);
      setClientPhases(updatedPhases);
    } finally {
      setSavingState(false);
      setOpRunning(false);
    }
  };

  const handleSessionOrderChange = async (
    sessionId: string,
    newSessionOrder: string
  ) => {
    setOpRunning(true);
    try {
      const data: any = {
        sessionId: sessionId,
        sessionOrder: newSessionOrder,
      };
      await updateSession(client_id, data);
      setToastMessage("Session re-ordered!");
      setToastType("success");
      setShowToast(true);
    } finally {
      setOpRunning(false);
    }
  };

  const handleSessionDelete = async (sessionId: string) => {
    setOpRunning(true);
    try {
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
      setToastMessage("Deleted session successfully!");
      setToastType("success");
      setShowToast(true);
    } finally {
      setOpRunning(false);
    }
  };

  const handleExerciseAdd = (phaseId: string, sessionId: string) => {
    setOpRunning(true);
    try {
      const newExerciseId = ID.unique();

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
                          id: newExerciseId,
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
                          exerciseOrder: session.exercises.length + 1, // Set the order to the current length + 1
                          setOrderMarker: "",
                          bias: "",
                          lenShort: "",
                          impliment: "",
                          grip: "",
                          angle: "",
                          support: "",
                          xtraInstructions: "",
                        },
                      ],
                    }
                  : session
              ),
            }
          : phase
      );
      setClientPhases(updatedPhases);
      setEditingExerciseId(newExerciseId);
    } finally {
      setOpRunning(false);
    }
  };

  const calculateSessionTime = (exercise: Exercise): number => {
    const maxReps = exercise.repsMax ?? 12; // Use the provided repsMax or default to 12
    const maxSets = exercise.setsMax ?? 5; // Use the provided setsMax or default to 5
    const restTime = exercise.restMax ?? 60; // Use the provided restMax or default to 60

    // Split and parse the tempo
    const tempoParts = exercise.tempo.split(" ").map(Number);
    const [eccentric, pause1, concentric, pause2] = tempoParts;

    // Calculate time per repetition based on the parsed tempo
    const timePerRep =
      (eccentric || 0) + (pause1 || 0) + (concentric || 0) + (pause2 || 0);

    const exerciseTime = maxReps * timePerRep; // Total exercise time based on max reps
    const totalRestTime = (maxSets - 1) * restTime; // Total rest time between sets

    return parseFloat(
      ((exerciseTime * maxSets + totalRestTime) / 60).toFixed(2)
    ); // Total session time in minutes with 2 decimal places
  };

  const handleExerciseUpdate = (
    phaseId: string,
    sessionId: string,
    updatedExercise: Exercise
  ) => {
    setHasUnsavedChanges(true);
    localStorage.setItem("workout-plan", "true");
    setOpRunning(true);
    try {
      console.log(clientPhases, sessionId);
      const sessions = clientPhases.flatMap((phase) => phase.sessions);
      const session = sessions.find((sess) => sess.sessionId === sessionId);

      const exerciseTime = calculateSessionTime(updatedExercise);
      console.log(session);
      if (session) {
        // Find the current exercise in the session to get its existing time
        const existingExercise = session.exercises.find(
          (e) => e.id === updatedExercise.id
        );
        const existingExerciseTime = existingExercise
          ? calculateSessionTime(existingExercise)
          : 0;

        // Calculate the new sessionTime
        const currentSessionTime = session.sessionTime ?? 0; // Default to 0 if null
        const newSessionTime = Number(
          (currentSessionTime - existingExerciseTime + exerciseTime).toFixed(2)
        ); // Add exerciseTime to the sessionTime

        // Update the exercise in the specific session and phase
        const updatedPhases = clientPhases.map((phase) =>
          phase.phaseId === phaseId
            ? {
                ...phase,
                sessions: phase.sessions.map((session) =>
                  session.sessionId === sessionId
                    ? {
                        ...session,
                        sessionTime: newSessionTime.toString(), // Update sessionTime
                        exercises: session.exercises.map((e) =>
                          e.id === updatedExercise.id ? updatedExercise : e
                        ),
                      }
                    : session
                ),
              }
            : phase
        );
        setClientPhases(updatedPhases);
      }
    } finally {
      setOpRunning(false);
    }
  };

  const handleEditExercise = (exerciseId) => {
    setOpRunning(true);
    setHasUnsavedChanges(true);
    localStorage.setItem("workout-plan", "true");
    try {
      setEditingExerciseId(exerciseId);
    } finally {
      setOpRunning(false);
    }
  };

  async function handleExerciseSave() {
    setOpRunning(true);
    setHasUnsavedChanges(false);
    localStorage.setItem("workout-plan", "false");
    try {
      setSavingState(true);
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
      setToastMessage("Exercise saved successfully!");
      setToastType("success");
      setShowToast(true);
    } finally {
      setSavingState(false);
      setOpRunning(false);
    }
  }

  const handleCancelEdit = () => {
    setOpRunning(true);
    setHasUnsavedChanges(false);
    localStorage.setItem("workout-plan", "false");
    try {
      setEditingExerciseId(null);
    } finally {
      setOpRunning(false);
    }
  };

  const handleExerciseDelete = async (
    phaseId: string,
    sessionId: string,
    exerciseId: string
  ) => {
    setOpRunning(true);
    try {
      let existingExerciseTime = 0;
      let existingSessionTime = 0;

      const updatedPhases = clientPhases.map((phase) => {
        if (phase.phaseId === phaseId) {
          return {
            ...phase,
            sessions: phase.sessions.map((session) => {
              if (session.sessionId === sessionId) {
                // Get the existing session time directly from the session object
                existingSessionTime = Number(session.sessionTime);

                const exercises = session.exercises.filter((e) => {
                  // Check if the exercise is the one to be deleted
                  if (e.id === exerciseId) {
                    // Calculate existing exercise time
                    existingExerciseTime = calculateSessionTime(e);
                    return false; // Filter it out
                  }
                  return true; // Keep other exercises
                });

                // Calculate the new session time based on existing
                const newSessionTime = parseFloat(
                  Number(existingSessionTime - existingExerciseTime).toFixed(2)
                ).toString();

                return {
                  ...session,
                  exercises,
                  sessionTime: newSessionTime, // Set the new session time
                };
              }
              return session; // Return session unchanged if it doesn't match
            }),
          };
        }
        return phase; // Return phase unchanged
      });

      setClientPhases(updatedPhases);

      const data: DataResponse = {
        phases: updatedPhases,
      };

      try {
        await axios.post(
          `${API_BASE_URL}/mvmt/v1/client/phases`,
          {
            client_id: client_id,
            data,
          },
          { withCredentials: true }
        );
        setToastMessage("Deleted exercise successfully!");
        setToastType("success");
        setShowToast(true);
      } catch (error) {
        console.error("Error deleting exercise:", error);
        // Handle error (e.g., show a notification to the user)
      }
    } finally {
      setOpRunning(false);
    }
  };

  const handleExerciseOrderChange = (
    phaseId: string,
    sessionId: string,
    updatedExercises: Exercise[]
  ) => {
    setOpRunning(true);
    try {
      // Update the exercise order in the specific session and phase
      const updatedPhases = clientPhases.map((phase) =>
        phase.phaseId === phaseId
          ? {
              ...phase,
              sessions: phase.sessions.map((session) =>
                session.sessionId === sessionId
                  ? {
                      ...session,
                      exercises: updatedExercises.map((exercise, index) => ({
                        ...exercise,
                        exerciseOrder: index + 1, // Update exerciseOrder to be 1-based index
                      })),
                    }
                  : session
              ),
            }
          : phase
      );
      setClientPhases(updatedPhases);
    } finally {
      setOpRunning(false);
    }
  };

  const handlePhaseDelete = async (phaseId: string) => {
    setOpRunning(true);
    try {
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
      setToastMessage("Deleted Phase successfully!");
      setToastType("success");
      setShowToast(true);
    } finally {
      setOpRunning(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="">
        <BreadcrumbLoading />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {phaseActivation && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg flex items-center justify-between gap-2">
            <LoadingSpinner />
            <span>
              {currentPhaseState ? "Activating" : "Deactivating"} Phase, Please
              wait.
            </span>
          </div>
        </div>
      )}
      <div className="flex justify-between">
        {opRunning || phaseAddingState ? (
          <div className="text-sm flex items-center justify-center px-4 secondary-btn capitalize gap-2 bg-gray-300 text-black cursor-not-allowed">
            <LoadingSpinner className="text-black w-4 h-4" />{" "}
            <span>Adding Phase</span>
          </div>
        ) : (
          <button
            className="text-sm flex items-center justify-center px-4 secondary-btn capitalize gap-2 bg-green-500 text-white"
            onClick={handleAddPhase}
          >
            <FaPlus />
            Add Phase
          </button>
        )}
      </div>
      {/* <DemoTable exercises={workouts} /> */}
      <div className="mt-4">
        <div className="w-full space-y-4">
          {clientPhases?.length === 0 ? (
            <div className="text-center py-4 px-6 bg-gray-100 rounded-md shadow-sm">
              <p className="text-gray-500 text-sm font-medium capitalize">
                No phases added yet
              </p>
              <p className="text-gray-400 text-xs mt-1 capitalize">
                Click &ldquo;Add Phase&rdquo; to get started
              </p>
            </div>
          ) : (
            clientPhases?.map((phase) => (
              <PhaseComponent
                setClientPhases={setClientPhases}
                handleSessionOrderChange={handleSessionOrderChange}
                key={phase.phaseId}
                phase={phase}
                workouts={workouts}
                handleCopyPhase={handleCopyPhase}
                onPhaseNameChange={handlePhaseNameChange}
                onPhaseDelete={handlePhaseDelete}
                onActivatePhase={handleActivatePhase}
                onAddSession={onAddSession}
                activePhaseId={
                  clientPhases.find((p) => p.isActive)?.phaseId || null
                }
                onSessionDelete={handleSessionDelete}
                onSessionNameChange={handleSessionNameChange}
                editingExerciseId={editingExerciseId}
                handleAddExercise={handleExerciseAdd}
                onExerciseUpdate={handleExerciseUpdate}
                onExerciseDelete={handleExerciseDelete}
                handleExerciseSave={handleExerciseSave}
                onExerciseOrderChange={handleExerciseOrderChange}
                onEditExercise={handleEditExercise}
                onCancelEdit={handleCancelEdit}
                client_id={client_id}
                nextSession={nextSession}
                progressId={progressId}
                setShowToast={setShowToast}
                setToastMessage={setToastMessage}
                setToastType={setToastType}
                savingState={savingState}
                opRunning={false}
                setOpRunning={(bool: boolean) => {}}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlan;
