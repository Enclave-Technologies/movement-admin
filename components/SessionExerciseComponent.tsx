import React, { FC, useState } from "react";
import {
    FaPlus,
} from "react-icons/fa";
import EditModeTable from "./EditModeTable";
import DragModeTable from "./DragModeTable";

const SessionExerciseComponent: FC<SessionExerciseProps> = ({
    phaseId,
    sessionId,
    exercises,
    workouts,
    editingExerciseId,
    onExerciseAdd,
    onExerciseUpdate,
    onExerciseDelete,
    onExerciseOrderChange,
    onEditExercise,
    onCancelEdit,
}) => {
    const [mode, setMode] = useState<"edit" | "draggable">("draggable");

    function handleDragEnd(event) {
        const { active, over } = event;

        if (active.id !== over.id) {
            const originalPos = exercises.findIndex((e) => e.id === active.id);
            const newPos = exercises.findIndex((e) => e.id === over.id);
            const newExercises = [...exercises];
            newExercises.splice(originalPos, 1);
            newExercises.splice(newPos, 0, exercises[originalPos]);
            onExerciseOrderChange(phaseId, sessionId, newExercises);
            console.log("drag end");
        }
    }

    const workoutOptions = workouts.map((workout) => ({
        value: workout.id,
        label: workout.SpecificDescription,
        workout: workout,
    }));

    return (
        <div className="mt-4 overflow-x-auto touch-action-none">
            {mode === "edit" ? (
                <EditModeTable
                    phaseId={phaseId}
                    sessionId={sessionId}
                    exercises={exercises}
                    workoutOptions={workoutOptions}
                    editingExerciseId={editingExerciseId}
                    onEditExercise={onEditExercise}
                    onExerciseDelete={onExerciseDelete}
                    onExerciseUpdate={onExerciseUpdate}
                    onCancelEdit={onCancelEdit}
                />
            ) : (
                <DragModeTable
                    exercises={exercises}
                    handleDragEnd={handleDragEnd}
                />
            )}
            <div className="sticky bottom-0 left-0 bg-white shadow-md py-4">
                <button
                    className={`flex items-center justify-center w-full rounded mt-4 px-4 py-2
                         bg-green-500 text-white hover:bg-green-900 
                         transition-colors duration-200 ${
                             mode === "edit" ? "" : "hidden"
                         }`}
                    onClick={() => onExerciseAdd(phaseId, sessionId)}
                >
                    <FaPlus className="mr-2" /> Add Exercise
                </button>
                <button
                    className={`flex items-center w-full mt-4 justify-center -z-10 rounded px-4 py-2 transition-colors duration-200 ${
                        mode === "edit"
                            ? "bg-blue-500 text-white hover:bg-blue-700"
                            : "secondary-btn"
                    }`}
                    onClick={() =>
                        setMode(mode === "edit" ? "draggable" : "edit")
                    }
                >
                    {mode === "edit" ? "Exit Edit Mode" : "Enter Edit Mode"}
                </button>
            </div>
        </div>
    );
};

export default SessionExerciseComponent;
