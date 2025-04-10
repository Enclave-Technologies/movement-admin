"use client";
import { useState, useCallback } from "react";
import { FaCheck, FaTrash, FaCalendarAlt } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { debounce } from "lodash-es";

// Define an extended interface for goal that includes notes and deadline
interface GoalWithDetails {
  id: string;
  description: string;
  completed: boolean;
  notes?: string;
  deadline?: string;
}

interface GoalTileProps {
  goal: GoalWithDetails;
  onUpdateGoal: (id: string, completed: boolean) => Promise<void>;
  isEditMode: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const GoalTile: React.FC<GoalTileProps> = ({
  goal,
  onUpdateGoal,
  isEditMode,
  onEdit,
  onDelete,
}) => {
  const [done, setDone] = useState(goal.completed);
  const [expanded, setExpanded] = useState(false);

  const debouncedUpdate = useCallback(
    debounce(async (newState: boolean) => {
      try {
        await onUpdateGoal(goal.id, newState);
      } catch (error) {
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

  const toggleExpand = (e: React.MouseEvent) => {
    if (isEditMode) return;
    e.stopPropagation();
    setExpanded(!expanded);
  };

  // Only deadline is available (notes removed due to collection attribute limit)
  const hasAdditionalInfo = goal.deadline;

  // Format deadline from ISO format
  const formattedDeadline = goal.deadline
    ? new Date(goal.deadline).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="flex flex-col w-full mb-2">
      <div className="flex items-center w-full">
        <button
          className={`flex flex-row justify-between items-center p-4 border border-black rounded-md text-left flex-grow ${
            done ? "bg-primary text-white" : ""
          } ${hasAdditionalInfo ? "rounded-b-none" : ""}`}
          onClick={handleClick}
          disabled={isEditMode}
        >
          <div className="flex flex-col">
            <p className="capitalize font-medium">{goal.description}</p>
            {formattedDeadline && (
              <div className="flex items-center text-xs mt-1">
                <FaCalendarAlt className="mr-1" />
                <span>{formattedDeadline}</span>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {hasAdditionalInfo && (
              <button onClick={toggleExpand} className="mr-2 text-xs underline">
                {expanded ? "Hide details" : "Show details"}
              </button>
            )}
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
          </div>
        </button>
        {isEditMode && (
          <div className="flex ml-2">
            <button onClick={onEdit} className="text-green-500 mr-2 p-2">
              <RiEdit2Fill className="w-6 h-6" />
            </button>
            <button onClick={onDelete} className="text-red-500 p-2">
              <FaTrash className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {expanded && hasAdditionalInfo && (
        <div
          className={`p-4 border border-t-0 border-black rounded-b-md ${
            done ? "bg-primary bg-opacity-10" : "bg-gray-50"
          }`}
        >
          {formattedDeadline && (
            <div className="mb-2">
              <h4 className="text-sm font-semibold mb-1">Deadline:</h4>
              <p className="text-sm">{formattedDeadline}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
