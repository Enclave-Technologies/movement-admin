"use client";
import { useState } from "react";
import { GoalTile } from "@/components/GoalTile"; // Import GoalTile
import { goals as dummyGoals } from "./dummyData";

// AddGoalModal Component
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
        <h1 className="text-lg font-bold">Add Goal</h1>
        <label htmlFor="goalType" className="block text-left mt-4 font-semibold">Goal Type</label>
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

// EditGoalModal Component
const EditGoalModal = ({ isOpen, onClose, onEditGoal, goalToEdit }) => {
  const [editedGoal, setEditedGoal] = useState(goalToEdit ? goalToEdit.goal : "");
  const [selectedGoalType, setSelectedGoalType] = useState(goalToEdit ? goalToEdit.type : "");

  const handleEditGoal = () => {
    if (editedGoal.trim()) {
      onEditGoal(selectedGoalType, editedGoal);
      setEditedGoal("");
      setSelectedGoalType("");
      onClose(); // Close the modal after editing
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-90"></div>
      <div className="fixed max-w-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg">
        <h1 className="text-lg font-bold">Edit Goal</h1>
        <label htmlFor="goalType" className="block text-left mt-4 font-semibold">Goal Type</label>
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
          value={editedGoal}
          onChange={(e) => setEditedGoal(e.target.value)}
          placeholder="Edit Goal"
          className="border rounded px-2 py-1 mt-2 w-full"
        />
        <button className="secondary-btn mt-2 ml-3 w-36" onClick={onClose}>
          Cancel
        </button>
        <button className="primary-btn mt-4 ml-3 w-36" onClick={handleEditGoal}>
          Save Changes
        </button>
      </div>
    </>
  );
};

// Main Page Component
export default function Page() {
  const [goals, setGoals] = useState(dummyGoals);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState(null);
  const [checkedGoals, setCheckedGoals] = useState({});

  const addGoal = (goalType, newGoal) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.type === goalType) {
        return { ...goal, goals: [...goal.goals, newGoal] };
      }
      return goal;
    });
    setGoals(updatedGoals);
  };

  const editGoal = (goalType, editedGoal) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.type === goalType) {
        return {
          ...goal,
          goals: goal.goals.map((g) => (g === goalToEdit.goal ? editedGoal : g)),
        };
      }
      return goal;
    });
    setGoals(updatedGoals);
  };

  const toggleGoal = (goalType, goal) => {
    setCheckedGoals((prev) => ({
      ...prev,
      [`${goalType}-${goal}`]: !prev[`${goalType}-${goal}`],
    }));
  };

  const handleEditClick = (goal) => {
    setGoalToEdit(goal);
    setIsEditModalOpen(true);
  };

  return (
    <div className="text-center mt-4 flex flex-col gap-8 w-full">
      <div className="w-full flex flex-row justify-end gap-4">
        <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
          Add Goal
        </button>
        <button className="secondary-btn" onClick={() => {
          if (goals[0].goals.length > 0) {
            const goal = goals[0].goals[0]; // Change this logic as needed
            setGoalToEdit({ type: goals[0].type, goal });
            setIsEditModalOpen(true);
          }
        }}>
          Edit Goals
        </button>
      </div>

      <AddGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddGoal={addGoal}
      />

      <EditGoalModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEditGoal={editGoal}
        goalToEdit={goalToEdit}
      />

      <div className="flex flex-col w-full gap-8">
        {goals.map((goal, i) => (
          <div key={i} className="flex flex-col w-full items-start gap-4">
            <h1 className="uppercase text-xl font-bold">{goal.type}</h1>
            <div className="flex flex-col gap-1 w-full">
              {goal.goals.map((goalItem, index) => (
                <GoalTile
                  key={index}
                  goal={goalItem}
                  onEdit={() => handleEditClick({ type: goal.type, goal: goalItem })}
                  checked={checkedGoals[`${goal.type}-${goalItem}`] || false}
                  onToggle={() => toggleGoal(goal.type, goalItem)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
