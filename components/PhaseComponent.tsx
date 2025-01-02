import React, { FC, useEffect, useRef, useState } from "react";
import SessionComponent from "./SessionComponent";
import {
    FaEdit,
    FaCopy,
    FaChevronDown,
    FaChevronUp,
    FaPlus,
    FaTrash,
    FaChevronRight,
    FaSave,
} from "react-icons/fa";
import { ID } from "appwrite";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import PhaseActions from "./phase/PhaseActions";
import TitleEditBox from "./phase/PhaseTitle";

const PhaseComponent: FC<PhaseProps> = ({
    phase,
    workouts,
    onPhaseNameChange,
    handleCopyPhase,
    onPhaseDelete,
    onActivatePhase,
    onAddSession,
    handleExerciseSave,
    activePhaseId,
    onSessionDelete,
    onSessionNameChange,
    editingExerciseId,
    handleAddExercise,
    onExerciseUpdate,
    onExerciseDelete,
    onExerciseOrderChange,
    onEditExercise,
    onCancelEdit,
    client_id,
    nextSession,
    progressId,
    setShowToast,
    setToastMessage,
    setToastType,
    savingState,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [phaseName, setPhaseName] = useState(phase.phaseName);
    const [showPhaseDeleteConfirm, setShowPhaseDeleteConfirm] = useState(false);
    const [tooltipText, setTooltipText] = useState("");

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing, inputRef]);

    const handlePhaseNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhaseName(e.target.value);
    };

    const handlePhaseNameSubmit = () => {
        console.log("submitting phase name");
        onPhaseNameChange(phase.phaseId, phaseName).then((res) => {
            setIsEditing(false);
        });
    };

    const handleActivatePhase = () => {
        onActivatePhase(phase.phaseId, !phase.isActive);
    };

    const handleAddSession = () => {
        const newSession: MovementSession = {
            sessionId: ID.unique(),
            sessionName: "Untitled Session",
            exercises: [],
            sessionOrder: phase.sessions.length + 1,
            sessionTime: "0",
        };

        // const handlePhaseNameSubmit = () => {
        //     setIsEditing(true);
        //     onPhaseNameChange(phase.phaseId, phaseName).then((res) => {
        //         setIsEditing(false);
        //     });
        // };

        // const handleActivatePhase = () => {
        //     onActivatePhase(phase.phaseId, !phase.isActive);
        // };

        // const handleAddSession = () => {
        //     const newSession: MovementSession = {
        //         sessionId: ID.unique(),
        //         sessionName: "Untitled Session",
        //         exercises: [],
        //         sessionOrder: phase.sessions.length + 1,
        //         sessionTime: "0",
        //     };
        onAddSession(phase.phaseId, newSession);
        setIsCollapsed(false);
    };

    const handleCopySession = (session) => {
        const newSession: MovementSession = {
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
            sessionOrder: phase.sessions.length + 1,
            sessionTime: "0",
        };
        onAddSession(phase.phaseId, newSession);
    };

    const handleDeletePhase = () => {
        setShowPhaseDeleteConfirm(true); // Show confirmation dialog
    };

    const confirmDeletePhase = () => {
        onPhaseDelete(phase.phaseId); // Perform delete
        setShowPhaseDeleteConfirm(false); // Close dialog
    };

    const cancelDeletePhase = () => {
        setShowPhaseDeleteConfirm(false); // Just close the dialog
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border w-full border-gray-200 ">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center w-1/2 gap-4">
                    <div className="px-1 py-1 flex justify-end">
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
                    </div>
                    <div className="flex flex-row gap-2 items-center relative">
                        <span className="font-medium">{phaseName}</span>
                        {isEditing && (
                            <TitleEditBox
                                title="Phase Title"
                                value={phaseName}
                                handleValueChange={handlePhaseNameChange}
                                handleValueSubmit={handlePhaseNameSubmit}
                                inputRef={inputRef}
                                setIsEditingTitle={setIsEditing}
                                savingState={savingState}
                            />
                        )}
                        <PhaseActions
                            phase={phase}
                            isEditingTitle={isEditing}
                            setIsEditingTitle={setIsEditing}
                            handleDeletePhase={handleDeletePhase}
                            handleCopyPhase={handleCopyPhase}
                            handleAddSession={handleAddSession}
                        />
                    </div>
                    {showPhaseDeleteConfirm && (
                        <DeleteConfirmationDialog
                            title={`Phase: ${phase.phaseName}`}
                            confirmDelete={confirmDeletePhase}
                            cancelDelete={cancelDeletePhase}
                        />
                    )}
                </div>
                <div
                    className={`flex items-center gap-2 ${
                        isEditing ? "hidden" : ""
                    }`}
                >
                    <div className="relative inline-block w-12 align-middle select-none">
                        <input
                            type="checkbox"
                            name="toggle"
                            id={`toggle-${phase.phaseId}`}
                            checked={phase.isActive}
                            onChange={handleActivatePhase}
                            className="checked:bg-green-500 hidden outline-none focus:ring focus:ring-green-500 duration-200 ease-in"
                        />
                        <label
                            htmlFor={`toggle-${phase.phaseId}`}
                            className={`block overflow-hidden h-6 rounded-full cursor-pointer relative transition-colors duration-200 ease-in-out ${
                                phase.phaseId === activePhaseId
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                            }`}
                        >
                            <span
                                className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in ${
                                    phase.phaseId === activePhaseId
                                        ? "translate-x-6"
                                        : ""
                                }`}
                            />
                        </label>
                    </div>

                    {/* 
                    {phase.isActive && (
                        <span className="px-3 py-1 text-green-500 bg-green-100 rounded-full">
                            Active
                        </span>
                    )} */}
                </div>
            </div>
            <div
                className={`px-4 py-3 w-full
                    ${isCollapsed ? "hidden" : ""}`}
            >
                {/* Render session components here */}
                {phase.sessions.length === 0 ? (
                    <div className="text-center py-4 px-6 bg-gray-100 rounded-md shadow-sm">
                        <p className="text-gray-500 text-sm font-medium uppercase">
                            No sessions added yet
                        </p>
                        <p className="text-gray-400 text-xs mt-1 uppercase">
                            Click &ldquo;Add Session&rdquo; to get started
                        </p>
                    </div>
                ) : (
                    phase.sessions
                        .sort((a, b) => a.sessionOrder - b.sessionOrder)
                        .map((session, index) => (
                            <SessionComponent
                                index={index}
                                phaseId={phase.phaseId}
                                key={session.sessionId}
                                session={session}
                                workouts={workouts}
                                onSessionDelete={onSessionDelete}
                                onSessionNameChange={onSessionNameChange}
                                editingExerciseId={editingExerciseId}
                                handleAddExercise={handleAddExercise}
                                onExerciseUpdate={onExerciseUpdate}
                                handleExerciseSave={handleExerciseSave}
                                onExerciseDelete={onExerciseDelete}
                                onExerciseOrderChange={onExerciseOrderChange}
                                onEditExercise={onEditExercise}
                                onCancelEdit={onCancelEdit}
                                client_id={client_id}
                                nextSession={nextSession}
                                progressId={progressId}
                                handleCopySession={handleCopySession}
                                setShowToast={setShowToast}
                                setToastMessage={setToastMessage}
                                setToastType={setToastType}
                                savingState={savingState}
                                isPhaseActive={phase.isActive}
                            />
                        ))
                )}
                {/* <button
                    className="flex items-center justify-center w-full mt-4 px-4 py-2 h-12 secondary-btn uppercase gap-5"
                    onClick={handleAddSession}
                >
                    <FaPlus className="text-lg" /> Add Session
                </button> */}
            </div>
        </div>
    );
};

export default PhaseComponent;
