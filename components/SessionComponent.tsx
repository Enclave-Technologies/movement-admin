import React, { FC, useEffect, useRef, useState } from "react";
import {
    FaChevronDown,
    FaChevronRight,
    FaChevronUp,
    FaCopy,
    FaEdit,
    FaPlus,
    FaSave,
    FaTrash,
} from "react-icons/fa";
import SessionExerciseComponent from "./SessionExerciseComponent";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/configs/constants";
import axios from "axios";
import TooltipButton from "./pure-components/TooltipButton";
import LoadingSpinner from "./LoadingSpinner";

const SessionComponent: FC<SessionProps> = ({
    index,
    phaseId,
    session,
    workouts,
    onSessionDelete,
    onSessionNameChange,
    editingExerciseId,
    onExerciseAdd,
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
}) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
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
        onSessionNameChange(session.sessionId, sessionName);
        setIsEditing(false);
    };

    const handleSessionDelete = () => {
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
            // setPageLoading(true);
            // setWorkoutPressed(true);
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
                setShowToast(true);
            }
        } catch (e) {
            console.error("Failed to start workout:", e);
        } finally {
            // setWorkoutPressed(false);
            // setPageLoading(false);
        }
    };

    return (
        <div className="bg-white p-4 border-b-[1px] border-gray-300 flex flex-col gap-4">
            <div className="flex items-center justify-between container-class relative">
                <div className="">
                    {isEditing ? (
                        <div className="flex w-full items-center gap-2">
                            <input
                                type="text"
                                className="w-72 px-3 py-2 text-gray-700 rounded-md border focus:outline-none"
                                value={sessionName}
                                onChange={handleSessionNameChange}
                                onBlur={handleSessionNameSubmit}
                                ref={inputRef}
                            />
                            <TooltipButton
                                tooltip="Save Session Name"
                                className="ml-2 text-green-500 hover:text-green-800 focus:outline-none focus:ring focus:ring-green-500"
                                onClick={() => {
                                    setIsEditing(false);
                                }}
                            >
                                <FaSave />
                            </TooltipButton>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
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
                                <div className="flex items-center gap-1">
                                    <span className="font-medium">
                                        {sessionName}
                                    </span>
                                    {savingState ? (
                                        <LoadingSpinner className="w-4 h-4 ml-2" />
                                    ) : (
                                        <>
                                            <TooltipButton
                                                tooltip="Rename Session"
                                                className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring focus:ring-green-500"
                                                onClick={() => {
                                                    setIsEditing(true);
                                                }}
                                            >
                                                <FaEdit />
                                            </TooltipButton>
                                            <TooltipButton
                                                tooltip="Delete Session"
                                                className="ml-2 text-red-400 hover:text-red-600 focus:outline-none focus:ring focus:ring-red-500"
                                                onClick={handleSessionDelete}
                                            >
                                                <FaTrash />
                                            </TooltipButton>
                                            <TooltipButton
                                                tooltip="Duplicate Session"
                                                className="ml-2 text-green-500 hover:text-green-900 focus:outline-none focus:ring focus:ring-green-500"
                                                onClick={() =>
                                                    handleCopySession(session)
                                                }
                                            >
                                                <FaCopy />
                                            </TooltipButton>
                                            <TooltipButton
                                                tooltip="Add Exercise"
                                                className="ml-2 text-green-500 hover:text-green-900 focus:outline-none focus:ring focus:ring-green-500"
                                                onClick={() => {
                                                    onExerciseAdd(
                                                        phaseId,
                                                        session.sessionId
                                                    );
                                                }}
                                            >
                                                <FaPlus />
                                                {/* <span className="hidden lg:flex">Copy</span> */}
                                            </TooltipButton>
                                        </>
                                    )}
                                </div>
                            </div>
                            {showSessionDeleteConfirm && (
                                <DeleteConfirmationDialog
                                    title={`Session: ${session.sessionName}`}
                                    confirmDelete={confirmSessionDelete}
                                    cancelDelete={cancelSessionDelete}
                                />
                            )}
                        </div>
                    )}
                </div>
                <div className="flex flex-row items-center gap-4">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded-md"
                        onClick={handleStartSession}
                    >
                        Start Session
                        {/* ( {session.sessionTime || "0"} mins) */}
                    </button>
                </div>
            </div>
            {!isCollapsed && (
                <SessionExerciseComponent
                    phaseId={phaseId}
                    sessionId={session.sessionId}
                    exercises={session.exercises}
                    workouts={workouts}
                    editingExerciseId={editingExerciseId}
                    onExerciseAdd={onExerciseAdd}
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
