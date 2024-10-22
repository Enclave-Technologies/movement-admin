"use client"
import { useState } from "react";
import { GoalTile } from "@/components/GoalTile";
import { goals as dummyGoals } from "./dummyData";

const AddGoalModal = ({ isOpen, onClose, onAddGoal }) => {
  const [newGoal, setNewGoal] = useState("");
  const [selectedGoalType, setSelectedGoalType] = useState("");

  const handleAddGoal = () => {
    if (newGoal.trim() && selectedGoalType) {
      onAddGoal(selectedGoalType, newGoal);
      setNewGoal("");
      setSelectedGoalType("");
      onClose(); // Close the modal after adding
    }
  };

  if (!isOpen) return null;
  

  return (
    <>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-90"></div>
      <div className="fixed max-w-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg">
        <h1 className="text-lg font-bold">Add  Goal</h1>
        <label htmlFor="goalType" className="">Goal Type </label>
        <select
        name="goalType"
          value={selectedGoalType}
          onChange={(e) => setSelectedGoalType(e.target.value)}
          className="border rounded px-2 py-1 mt-2 w-full"
        >
              
          <option value="">Select Goal Type</option>
          {dummyGoals.map((goal, index) => (
            <option key={index} value={goal.type}>
              {goal.type}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="New Goal"
          className="border rounded px-2 py-1 mt-2 w-full"
        />

        <button className="secondary-btn mt-2 ml-3 w-36" onClick={onClose}>
          Cancel
        </button>
        <button className="primary-btn mt-4 ml-3 w-36" onClick={handleAddGoal}>
          Add Goal
        </button>
      
      </div>
    </>
  );
};

export default function Page() {
  const [goals, setGoals] = useState(dummyGoals);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addGoal = (goalType, newGoal) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.type === goalType) {
        return { ...goal, goals: [...goal.goals, newGoal] };
      }
      return goal;
    });
    setGoals(updatedGoals);
  };

  return (
    <div className="text-center mt-4 flex flex-col gap-8 w-full">
      <div className="w-full flex flex-row justify-end gap-4">
        <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
          Add Goal
        </button>
        <button className="secondary-btn">Edit Goals</button>
      </div>
      <AddGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddGoal={addGoal}
      />
      <div className="flex flex-col w-full gap-8">
        {goals.map((goal, i) => (
          <div key={i} className="flex flex-col w-full items-start gap-4">
            <h1 className="uppercase text-xl font-bold">{goal.type}</h1>
            <div className="flex flex-col gap-1 w-full">
              {goal.goals.map((goal, index) => (
                <GoalTile key={index} goal={goal} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
