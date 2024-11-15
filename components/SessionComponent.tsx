import React, { FC, useEffect, useRef, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import SessionExerciseComponent from "./SessionExerciseComponent";

const SessionComponent: FC<SessionProps> = ({
    phaseId,
    session,
    workouts,
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
    const [sessionName, setSessionName] = useState(session.sessionName);
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
        onSessionDelete(session.sessionId);
    };
    return (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4 mb-4 ">
            <div className="flex items-center justify-between container-class relative">
                <div className="">
                    {isEditing ? (
                        <input
                            type="text"
                            className="w-full px-3 py-2 text-gray-700 rounded-md border focus:outline-none"
                            value={sessionName}
                            onChange={handleSessionNameChange}
                            onBlur={handleSessionNameSubmit}
                            ref={inputRef}
                        />
                    ) : (
                        <div className="flex items-center">
                            <span className="font-medium">{sessionName}</span>
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
                                onClick={handleSessionDelete}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    )}
                </div>

                <div className="text-gray-500 text-sm">
                    {session.sessionTime || "0"} mins
                </div>
            </div>
            <SessionExerciseComponent
                phaseId={phaseId}
                sessionId={session.sessionId}
                exercises={session.exercises}
                workouts={workouts}
                editingExerciseId={editingExerciseId}
                onExerciseAdd={onExerciseAdd}
                onExerciseUpdate={onExerciseUpdate}
                onExerciseDelete={onExerciseDelete}
                onExerciseOrderChange={onExerciseOrderChange}
                onEditExercise={onEditExercise}
                onCancelEdit={onCancelEdit}
            />
        </div>
    );
};

export default SessionComponent;
