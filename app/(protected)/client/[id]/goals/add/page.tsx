"use client";
import { useEffect, useState } from "react";
import { BiMinus } from "react-icons/bi";

export default function Page() {
  const [goals, setGoals] = useState([
    { type: "physique-goal", description: "" },
  ]);
  useEffect(() => {
    console.log(goals);
    if (goals.length == 0) {
      setGoals([{ type: "physique-goal", description: "" }]);
    }
  }, [goals]);
  return (
    <div className="w-full flex flex-col gap-8 pt-4">
      <div className="flex flex-row justify-between w-full items-end">
        <h1 className="text-xl font-bold pl-2">Add Goals</h1>
        <button className="primary-btn">Save All</button>
      </div>
      <div className="flex flex-col gap-4">
        {goals.map((goal, index) => (
          <div className="flex flex-row gap-2">
            <div className="p-2 border border-gray-300 rounded-lg">
              <select
                onChange={(e) => {
                  goals[index].type == e.target.value;
                  setGoals([...goals]);
                }}
              >
                <option value="physique-goal">Physique Goal</option>
                <option value="performance-goal">Performance Goal</option>
                <option value="skill-goal">Skill Goal</option>
              </select>
            </div>
            <input
              placeholder={
                goal.type == "physique-goal"
                  ? "eg: Body Fat Below 12%"
                  : goal.type == "performance-goal"
                  ? "eg: DB Bench Press: 50kg x 10 reps"
                  : goal.type == "skill-goal"
                  ? "eg: Learn to do a handstand"
                  : ""
              }
              value={goal.description}
              onChange={(e) => {
                goals[index].description = e.target.value;
                setGoals([...goals]);
              }}
              className="border border-gray-300 p-2 flex-1 rounded-lg"
            />
            <button
              onClick={() => {
                goals.splice(index, 1);
                setGoals([...goals]);
              }}
              className="border border-black p-2 rounded-full w-10 flex items-center justify-center ml-20"
            >
              <BiMinus />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          setGoals([...goals, { type: "physique-goal", description: "" }]);
        }}
      >
        + Add More Goals
      </button>
    </div>
  );
}
