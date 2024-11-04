"use client";
import React, { useState } from "react";
import { ID } from "appwrite";
import ExerciseTable from "./ExerciseTable";
import { FiEdit } from "react-icons/fi";
import { addSessionToPhase } from "@/utils/addSessionToPhase";

const SessionRenderer: React.FC<SessionRendererProps> = ({
    selectedPhase,
    phases,
    setPhases,
}) => {
    const [editingSessionId, setEditingSessionId] = useState<string | null>(
        null
    );

    const handleSessionNameChange = (sessionId: string, newName: string) => {
        const updatedPhases = phases.map((phase) => ({
            ...phase,
            sessions: phase.sessions.map((session) =>
                session.id === sessionId
                    ? { ...session, sessionName: newName }
                    : session
            ),
        }));
        setPhases(updatedPhases);
    };

    // const addSessionToPhase = (selectedPhase: Phase) => {
    //     const newSession = {
    //         id: ID.unique(),
    //         sessionName: "New Session",
    //         sessionOrder: selectedPhase.sessions.length + 1,
    //         phases: selectedPhase.id,
    //         exercises: [],
    //     };
    //     alert(`Adding session: ${JSON.stringify(newSession)}`);
    //     // selectedPhase.sessions.push(newSession);
    //     // Update the phases state
    //     const updatedPhases = phases.map((phase) => {
    //         if (phase.id === selectedPhase.id) {
    //             return {
    //                 ...phase,
    //                 sessions: [...phase.sessions, newSession],
    //             };
    //         }
    //         return phase;
    //     });

    //     setPhases(updatedPhases);
    // };

    return (
        <div className="space-y-6">
            {selectedPhase?.sessions.map((session) => (
                <div
                    key={session.id}
                    className="bg-white shadow-md rounded-lg p-6"
                >
                    <div className="flex items-center mb-4">
                        {editingSessionId === session.id ? (
                            <input
                                type="text"
                                value={session.sessionName}
                                onChange={(e) =>
                                    handleSessionNameChange(
                                        session.id,
                                        e.target.value
                                    )
                                }
                                onBlur={() => setEditingSessionId(null)}
                                autoFocus
                                className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 focus:outline-none"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold text-gray-800">
                                {session.sessionName}
                            </h2>
                        )}
                        <button
                            onClick={() => setEditingSessionId(session.id)}
                            className="ml-2 text-gray-500 hover:text-blue-500 focus:outline-none"
                        >
                            <FiEdit size={20} />
                        </button>
                    </div>
                    <ExerciseTable exercises={session.exercises} />
                </div>
            ))}
            <button
                className="w-full bg-green-500 hover:bg-green-900 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                    console.log("Add Session clicked");
                    addSessionToPhase({ selectedPhase, phases, setPhases });
                }}
            >
                Add Session
            </button>
        </div>
    );
};

export default SessionRenderer;
