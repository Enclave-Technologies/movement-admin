import React, { FC, useEffect, useRef, useState } from "react";
import { FaChevronRight, FaChevronUp } from "react-icons/fa";
import SessionExerciseComponent from "./SessionExerciseComponent";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/configs/constants";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import TitleEditBox from "./phase/PhaseTitle";
import { RxDragHandleDots1 } from "react-icons/rx";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SessionComponent: FC<SessionProps> = ({
  index,
  phaseId,
  session,
  workouts,
  onSessionDelete,
  onSessionNameChange,
  editingExerciseId,
  handleAddExercise,
  onExerciseUpdate,
  handleExerciseSave,
  onExerciseDelete,
  onExerciseOrderChange,
  onEditExercise,
  onCancelEdit,
  client_id,
  nextSession,
  progressId,
  handleCopySession,
  setShowToast,
  setToastMessage,
  setToastType,
  savingState,
  isPhaseActive,

}) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [startingWorkout, setStartingWorkout] = useState(false);
    const [sessionName, setSessionName] = useState(session.sessionName);
    const [showSessionDeleteConfirm, setShowSessionDeleteConfirm] =
        useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing, inputRef]);

    const handleSessionNameChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSessionName(e.target.value);
    };

  const handleSessionNameSubmit = () => {
    onSessionNameChange(session.sessionId, sessionName).then((res) => {
      setIsEditing(false);
    });
  };

  const handleDeleteSession = () => {
    setShowSessionDeleteConfirm(true); // Show confirmation dialog
  };

    const confirmSessionDelete = () => {
        onSessionDelete(session.sessionId); // Perform delete
        setShowSessionDeleteConfirm(false); // Close dialog
    };

    const cancelSessionDelete = () => {
        setShowSessionDeleteConfirm(false); // Just close the dialog
    };

    const handleStartSession = async () => {
        // e.preventDefault();
        try {
            setStartingWorkout(true);
            console.log("Preparing to start workout...");
            const response = await axios.post(
                `${API_BASE_URL}/mvmt/v1/client/start-workouts`,
                {
                    progress_id: progressId,
                    client_id: client_id,
                    phase_id: phaseId,
                    session_id: session.sessionId,
                },
                {
                    withCredentials: true,
                }
            );

            if (response.data.status) {
                router.push(
                    `/record-workout?clientId=${client_id}&phaseId=${phaseId}&sessionId=${session?.sessionId}`
                );
            } else {
                setToastMessage(response.data.message);
                setToastType("error");
                setStartingWorkout(false);
                setShowToast(true);
            }
        } catch (e) {
            console.error("Failed to start workout:", e);
        } finally {
        }
    };

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: session.sessionId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className="bg-white flex flex-col gap-4"
      ref={setNodeRef}
      style={style}
    >
      {startingWorkout && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg flex items-center justify-between gap-2">
            <LoadingSpinner />
            <span>Starting Workout.</span>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between container-class relative ">
        <div className="w-full">
          <div className="flex items-center gap-4 w-full">
            <div {...attributes} {...listeners}>
              <RxDragHandleDots1 size={16} />
            </div>
            <div className="w-full flex items-center justify-between gap-2 border-b-[1px] border-gray-300 py-4">
              <div className="flex flex-row items-center justify-start gap-2">
                <button
                  className="flex items-center gap-1 p-1 text-gray-400 hover:text-gray-600 transition-all duration-200"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                >
                  {isCollapsed ? (
                    <>
                      <FaChevronRight className="text-lg" />
                    </>
                  ) : (
                    <>
                      <FaChevronUp className="text-lg" />
                    </>
                  )}
                </button>
                <div className="flex flex-row gap-2 items-center relative">
                  <span className="font-medium">{sessionName}</span>
                  {/* {nextSession?.$id === session.sessionId ? (
                    <span className="text-xs text-gray-400">(RECOMMENDED)</span>
                  ) : (
                    ""
                  )} */}
                  {isEditing && (
                    <TitleEditBox
                      title="Session Title"
                      value={sessionName}
                      handleValueChange={handleSessionNameChange}
                      handleValueSubmit={handleSessionNameSubmit}
                      inputRef={inputRef}
                      setIsEditingTitle={setIsEditing}
                      savingState={savingState}
                    />
                  )}
                  <SessionActions
                    phaseId={phaseId}
                    session={session}
                    setIsEditingTitle={setIsEditing}
                    handleDeleteSession={handleDeleteSession}
                    handleCopySession={handleCopySession}
                    handleAddExercise={handleAddExercise}
                  />
                </div>
              </div>
              <div className="flex flex-row items-center gap-4">
                <button
                  className={`${
                    isPhaseActive
                      ? "bg-green-500"
                      : "bg-gray-500 cursor-not-allowed"
                  } text-white px-4 py-2 rounded-md`}
                  disabled={!isPhaseActive}
                  onClick={handleStartSession}
                >
                  {`Start Session`} ({session.sessionTime || "0"} mins)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSessionDeleteConfirm && (
        <DeleteConfirmationDialog
          title={`Session: ${session.sessionName}`}
          confirmDelete={confirmSessionDelete}
          cancelDelete={cancelSessionDelete}
        />
      )}
      {!isCollapsed && (
        <SessionExerciseComponent
          phaseId={phaseId}
          sessionId={session.sessionId}
          exercises={session.exercises}
          workouts={workouts}
          editingExerciseId={editingExerciseId}
          handleAddExercise={handleAddExercise}
          onExerciseUpdate={onExerciseUpdate}
          onExerciseDelete={onExerciseDelete}
          handleExerciseSave={handleExerciseSave}
          onExerciseOrderChange={onExerciseOrderChange}
          onEditExercise={onEditExercise}
          onCancelEdit={onCancelEdit}
          savingState={savingState}
        />
      )}
    </div>
  );
};

export default SessionComponent;
