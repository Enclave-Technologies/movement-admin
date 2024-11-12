"use client";
import { useState, useCallback } from "react";
import { FaCheck } from "react-icons/fa";
import { debounce } from "lodash-es";

export const GoalTile = ({
    goal,
    onUpdateGoal,
}: {
    goal: { id: string; description: string; completed: boolean };
    onUpdateGoal: (id: string, completed: boolean) => Promise<void>;
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
        const newState = !done;
        setDone(newState); // Optimistic update
        debouncedUpdate(newState);
    };

    return (
        <button
            className={`flex flex-row justify-between items-center p-4 border border-black rounded-md text-left ${
                done ? "bg-primary text-white" : ""
            }`}
            onClick={handleClick}
        >
            <p className="capitalize">{goal.description}</p>
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
        </button>
    );
};
