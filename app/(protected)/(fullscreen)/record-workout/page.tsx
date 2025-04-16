"use client";
import React, { Suspense, useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import SearchParamsLoader from "@/components/WorkoutRecordDataLoader";
import WorkoutRecordHeader from "@/components/WorkoutRecordHeader";
import WorkoutRecordBody from "@/components/WorkoutRecordBody";
import { ID } from "appwrite";
import axios from "axios";
import { API_BASE_URL } from "@/configs/constants";
import ConfirmationDialog from "@/components/ConfrmationDialog";

const RecordWorkout = () => {
  const [clientId, setClientId] = useState("");
  const [phaseId, setPhaseId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [workoutTrackId, setWorkoutTrackId] = useState("");

  const [pageLoading, setPageLoading] = useState(true);
  const [openExercises, setOpenExercises] = useState([]);
  const [sessionInformation, setSessionInformation] = useState(null);
  const [exerciseData, setExerciseData] = useState([]);
  const [savedExerciseData, setSavedExerciseData] = useState([]);
  const [savingState, setSavingState] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Add the beforeunload event listener
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    // e.returnValue = "";
    setShowDeleteDialog(true);
  };

  // window.addEventListener("beforeunload", handleBeforeUnload);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

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
                set.id === setId ? { ...set, [field]: value } : set
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
      if (exerciseData.length > 0 && exerciseData !== savedExerciseData) {
        setSavingState(true);
        await axios.post(
          `${API_BASE_URL}/mvmt/v1/client/workout-tracker`,
          {
            clientId,
            phaseId,
            sessionId,
            exerciseData,
            workoutTrackId,
          },
          { withCredentials: true }
        );
        setSavedExerciseData(exerciseData);
      }
    } catch (error) {
      console.error("Error saving workout data:", error);
    } finally {
      setSavingState(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (exerciseData.length > 0 && exerciseData !== savedExerciseData) {
        saveToDatabase();
        setSavedExerciseData(exerciseData);
      }
    }, 600000); // 10 minutes (600,000 milliseconds)

    return () => clearInterval(interval);
  }, []);

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

  const handleRemoveSet = (exerciseId, setIndex) => {
    setExerciseData((prevExerciseData) =>
      prevExerciseData.map((exercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            sets: exercise.sets.filter((_, index) => index !== setIndex),
          };
        }
        return exercise;
      })
    );
  };

  const handleExit = () => {
    window.location.href = `/client/${clientId}`;
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
        workoutTrackId={workoutTrackId}
        setSessionInformation={setSessionInformation}
        sessionInformation={sessionInformation}
        setExerciseData={setExerciseData}
        exerciseData={exerciseData}
        setPageLoading={setPageLoading}
        pageLoading={pageLoading}
        onSave={saveToDatabase}
      />
      {pageLoading ? (
        <div className="bg-green-800">
          <Spinner />
        </div>
      ) : (
        <div className="min-h-screen bg-green-800 flex flex-col items-center">
          <div className="flex flex-col w-full max-w-full mx-auto">
            {showDeleteDialog && (
              <ConfirmationDialog
                cancelAction={() => {
                  setShowDeleteDialog(false);
                }}
                title={`You have unsaved changes`}
                message={`Are you sure you want to exit this page?`}
                button1={
                  <button
                    className="hover:underline"
                    onClick={() => handleExit()}
                  >
                    Exit
                  </button>
                }
                button2={
                  <button
                    onClick={async () => {
                      await saveToDatabase();
                      handleExit();
                    }}
                    className="min-w-24 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Save & Exit
                  </button>
                }
              />
            )}
            <WorkoutRecordHeader
              setShowDeleteDialog={setShowDeleteDialog}
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
              handleExerciseNotesChange={handleExerciseNotesChange}
              handleAddSet={handleAddSet}
              handleRemoveSet={handleRemoveSet}
            />
          </div>
        </div>
      )}
    </Suspense>
  );
};

export default RecordWorkout;
