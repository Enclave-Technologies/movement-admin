"use client";
import { useState, useCallback } from "react";
import { FaCheck, FaTrash } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { debounce } from "lodash-es";

export const GoalTile: React.FC<GoalTileProps> = ({
    goal,
    onUpdateGoal,
    isEditMode,
    onEdit,
    onDelete,
}) => {
    const [done, setDone] = useState(goal.completed);

    const debouncedUpdate = useCallback(
        debounce(async (newState: boolean) => {
            try {
                await onUpdateGoal(goal.id, newState);
            } catch (error) {
                console.error("Failed to update goal:", error);
                setDone(!newState); // Revert the state if the update fails
            }
        }, 500),
        [goal.id, onUpdateGoal]
    );

    const handleClick = () => {
        if (!isEditMode) {
            const newState = !done;
            setDone(newState); // Optimistic update
            debouncedUpdate(newState);
        }
    };

    return (
        <div className="flex items-center w-full">
            <button
                className={`flex flex-row justify-between items-center p-4 border border-black rounded-md text-left flex-grow ${
                    done ? "bg-primary text-white" : ""
                }`}
                onClick={handleClick}
                disabled={isEditMode}
            >
                <p className="uppercase">{goal.description}</p>
                {!isEditMode && (
                    <div
                        className={`w-6 aspect-square border rounded-full flex items-center justify-center ${
                            done ? "bg-white border-white" : "border-black"
                        }`}
                    >
                        <FaCheck
                            className="color-white"
                            color={done ? "#000" : "#FFF"}
                        />
                    </div>
                )}
            </button>
            {isEditMode && (
                <div className="flex ml-2">
                    <button
                        onClick={onEdit}
                        className="text-green-500 mr-2 p-2"
                    >
                        <RiEdit2Fill className="w-6 h-6" />
                    </button>
                    <button onClick={onDelete} className="text-red-500 p-2">
                        <FaTrash className="w-6 h-6" />
                    </button>
                </div>
            )}
        </div>
    );
};
