import React, { FC, useEffect, useRef, useState } from "react";
import SessionComponent from "./SessionComponent";
import {
    FaEdit,
    FaCopy,
    FaChevronDown,
    FaChevronUp,
    FaPlus,
    FaTrash,
} from "react-icons/fa";
import { ID } from "appwrite";
import { on } from "events";

const PhaseComponent: FC<PhaseProps> = ({
    phase,
    workouts,
    onPhaseNameChange,
    handleCopyPhase,
    onPhaseDelete,
    onActivatePhase,
    onAddSession,
    activePhaseId,
    onSessionDelete,
    onSessionNameChange,
    editingExerciseId,
    onExerciseAdd,
    onExerciseUpdate,
    onExerciseDelete,
    onExerciseOrderChange,
    onEditExercise,
    onCancelEdit,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [phaseName, setPhaseName] = useState(phase.phaseName);
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
        onPhaseNameChange(phase.phaseId, phaseName);
        setIsEditing(false);
    };

    const handleActivatePhase = () => {
        onActivatePhase(phase.phaseId, !phase.isActive);
    };

    const handleAddSession = () => {
        const newSession: MovementSession = {
            sessionId: ID.unique(),
            sessionName: "New Session",
            exercises: [],
            sessionOrder: phase.sessions.length + 1,
            sessionTime: "0",
        };
        onAddSession(phase.phaseId, newSession);
    };

    return (
        <div className="bg-white rounded-lg shadow-md border w-full border-gray-200 ">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center w-1/2">
                    {isEditing ? (
                        <input
                            type="text"
                            className="w-full px-3 py-2 text-gray-700 rounded-md border focus:outline-none "
                            value={phaseName}
                            onChange={handlePhaseNameChange}
                            onBlur={handlePhaseNameSubmit}
                            ref={inputRef}
                        />
                    ) : (
                        <>
                            <span className="font-medium">{phaseName}</span>
                            <button
                                className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring focus:ring-green-500"
                                onClick={() => {
                                    setIsEditing(true);
                                }}
                            >
                                <FaEdit />
                            </button>
                            <button
                                className="ml-2 text-red-400 hover:text-red-600 focus:outline-none focus:ring focus:ring-red-500"
                                onClick={() => {
                                    onPhaseDelete(phase.phaseId);
                                }}
                            >
                                <FaTrash />
                            </button>
                            <button
                                className="ml-2 text-green-500 hover:text-green-900 focus:outline-none focus:ring focus:ring-green-500"
                                onClick={() => handleCopyPhase(phase.phaseId)}
                            >
                                <FaCopy />
                                {/* <span className="hidden lg:flex">Copy</span> */}
                            </button>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative inline-block w-14 align-middle select-none">
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
                            className={`block overflow-hidden h-8 rounded-full cursor-pointer relative transition-colors duration-200 ease-in-out ${
                                phase.phaseId === activePhaseId
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                            }`}
                        >
                            <span
                                className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in ${
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
                    <div className="px-1 py-1 flex justify-end">
                        <button
                            className="flex items-center gap-1 p-1 text-gray-400 hover:text-gray-600 transition-all duration-200"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                        >
                            {isCollapsed ? (
                                <>
                                    <FaChevronDown className="text-lg" />
                                </>
                            ) : (
                                <>
                                    <FaChevronUp className="text-lg" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <div
                className={`px-4 py-3 w-full ${isEditing ? "hidden" : ""} ${
                    isCollapsed ? "hidden" : ""
                } `}
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
                        .map((session) => (
                            <SessionComponent
                                phaseId={phase.phaseId}
                                key={session.sessionId}
                                session={session}
                                workouts={workouts}
                                onSessionDelete={onSessionDelete}
                                onSessionNameChange={onSessionNameChange}
                                editingExerciseId={editingExerciseId}
                                onExerciseAdd={onExerciseAdd}
                                onExerciseUpdate={onExerciseUpdate}
                                onExerciseDelete={onExerciseDelete}
                                onExerciseOrderChange={onExerciseOrderChange}
                                onEditExercise={onEditExercise}
                                onCancelEdit={onCancelEdit}
                            />
                        ))
                )}
                <button
                    className="flex items-center justify-center w-full mt-4 px-4 py-2 text-gray-400 hover:text-gray-600 transition-colors duration-200  uppercase gap-5"
                    onClick={handleAddSession}
                >
                    <FaPlus className="text-lg" /> Add Session
                </button>
            </div>
        </div>
    );
};

export default PhaseComponent;
