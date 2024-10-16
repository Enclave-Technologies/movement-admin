"use client";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";

export const GoalTile = ({
  goal,
}: {
  goal: { description: string; completed: boolean };
}) => {
  const [done, setDone] = useState(goal.completed);
  return (
    <button
      className={`flex flex-row justify-between items-center p-4 border border-black rounded-md text-left ${
        done ? "bg-primary text-white" : ""
      }`}
      onClick={() => {
        console.log("pressed");
        setDone(!done);
      }}
    >
      <p className="capitalize">{goal.description}</p>
      <div
        className={`w-6 aspect-square border rounded-full flex items-center justify-center ${
          done ? "bg-white border-white" : "border-black"
        }`}
      >
        <FaCheck className="color-white" color={done ? "#000" : "#FFF"} />
      </div>
    </button>
  );
};
